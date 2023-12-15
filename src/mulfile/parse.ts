import { rocket } from "./rocket";
import ndarray, { NdArray } from "ndarray";
import ops from "ndarray-ops";
// @ts-ignore
import qr from "ndarray-householder-qr";
// @ts-ignore
import fill from "ndarray-fill";
// @ts-ignore
import concatCols from "ndarray-concat-cols";
import { correct_plane_wasm } from "../../wasm/pkg";

export class MulImage {
    private isProcessed: boolean;
    static qrResult: NdArray<Float32Array> | null = null;

    constructor(
        public imgNum: number,
        public imgID: string,
        public byteSize: number,
        public xres: number,
        public yres: number,
        public zres: number,
        public datetime: Date,
        public xsize: number,
        public ysize: number,
        public xoffset: number,
        public yoffset: number,
        public zscale: number,
        public tilt: number,
        public speed: number,
        public lineTime: number,
        public bias: number,
        public current: number,
        public sample: string,
        public title: string,
        public postpr: number,
        public postd1: number,
        public mode: number,
        public currfac: number,
        public numPointscans: number,
        public unitnr: number,
        public version: number,
        public gain: number,
        public imgData: Float32Array | Uint8ClampedArray,
    ) {
        this.isProcessed = false;
    }

    setImgID(imgID: string) {
        this.imgID = imgID;
    }

    process() {
        if (this.isProcessed) return;

        this.flipImgData();
        this.correctPlaneWasm();
        this.correctLines();
        this.imgDataToUint8Clamped("rocket");

        this.isProcessed = true;
    }

    imgDataToUint8Clamped(colormap: string) {
        if (this.imgData.length > this.xres * this.yres) {
            return;
        }
        const imageData = this.imgData as Float32Array;
        const min = imageData.reduce((min: number, v: number) =>
            Math.min(min, v)
        );
        const max = imageData.reduce((max: number, v: number) =>
            Math.max(max, v)
        );
        const diff = max - min;

        const newArr = new Uint8ClampedArray(this.imgData.length * 4);

        for (let i = 0; i < this.imgData.length; i++) {
            const grey = 255 -
                Math.round(((this.imgData[i] - min) / diff) * 255);
            newArr[4 * i + 3] = 255;
            if (colormap === "rocket") {
                newArr[4 * i] = rocket[grey][0];
                newArr[4 * i + 1] = rocket[grey][1];
                newArr[4 * i + 2] = rocket[grey][2];
            } else if (colormap === "grey") {
                newArr[4 * i] = grey;
                newArr[4 * i + 1] = grey;
                newArr[4 * i + 2] = grey;
            }
        }
        this.imgData = newArr;
    }

    flipImgData() {
        const len = this.imgData.length;
        const newArr = new Float32Array(len);

        for (let i = len; i > 0; i -= this.yres) {
            const line = this.imgData.slice(i - this.yres, i);
            newArr.set(line, len - i);
        }
        this.imgData = newArr;
    }

    correctPlaneWasm() {
        this.imgData = correct_plane_wasm(this.imgData as Float32Array, this.xres, this.yres);
    }

    correctPlane() {
        const arr: NdArray = ndarray(new Float32Array(this.imgData), [
            this.yres,
            this.xres,
        ]);
        const arrFlat = ndarray(new Float32Array(this.imgData));
        arrFlat.shape = [this.yres * this.xres];
        arrFlat.stride = [1];

        const ones = ndarray(new Float32Array(this.yres * this.xres), [
            this.yres,
            this.xres,
        ]);
        fill(ones, () => 1);
        const xCoords = ndarray(new Float32Array(this.yres * this.xres), [
            this.yres,
            this.xres,
        ]);
        fill(xCoords, (_: number, j: number) => j);
        const yCoords = ndarray(new Float32Array(this.yres * this.xres), [
            this.yres,
            this.xres,
        ]);
        fill(yCoords, (i: number, _: number) => i);

        // flatten arrays
        ones.shape = [this.yres * this.xres, 1];
        ones.stride = [1, 1];
        xCoords.shape = [this.yres * this.xres, 1];
        xCoords.stride = [1, 1];
        yCoords.shape = [this.xres * this.xres, 1];
        yCoords.stride = [1, 1];
        // create the coefficient matrix
        const coefficientMatrix = concatCols([ones, xCoords, yCoords]);

        // 512 x 512 again
        ones.shape = [this.yres, this.xres];
        ones.stride = [this.yres, 1];
        xCoords.shape = [this.yres, this.xres];
        xCoords.stride = [this.yres, 1];
        yCoords.shape = [this.yres, this.xres];
        yCoords.stride = [this.yres, 1];

        // allocate factor
        const qrFactor = ndarray(new Float32Array(3));
        // save qr result from coefficent matrix in factor
        qr.factor(coefficientMatrix, qrFactor);
        // solve system of linear equations, the resulting vector is saved in
        //   the first three elements of original_flat
        qr.solve(coefficientMatrix, qrFactor, arrFlat);

        // get these elements
        const first = arrFlat.get(0);
        const second = arrFlat.get(1);
        const third = arrFlat.get(2);

        // allocate matrix for the background
        const correction = ndarray(new Float32Array(this.yres * this.xres), [
            this.yres,
            this.xres,
        ]);
        // calculate background
        ops.mulseq(ones, first);
        ops.mulseq(xCoords, second);
        ops.mulseq(yCoords, third);
        ops.add(correction, ones, xCoords);
        ops.addeq(correction, yCoords);

        // get another original as image matrix as first three elements were overwritten
        // substract background
        ops.subeq(arr, correction);
        this.imgData = new Float32Array(arr.data as Float32Array);
    }

    correctLines() {
        for (let i = 0; i < this.yres; ++i) {
            let row = this.imgData.subarray(
                i * this.yres,
                (i * this.xres) + this.xres,
            ) as Float32Array;
            const rowMean = row.reduce((a, b) => a + b, 0) / this.xres;
            for (let j = 0; j < this.xres; ++j) {
                row[j] -= rowMean;
            }
        }
    }
}

export function parseMul(buffer: ArrayBuffer) {
    // const buffer = file.arrayBuffer();

    const dv: DataView = new DataView(buffer);
    const MUL_BLOCK = 128;

    let nr = dv.getInt16(0, true);
    let adr = dv.getInt32(2, true);

    let pos;
    let blockCounter = 0;

    if (adr === 3) {
        pos = MUL_BLOCK * adr - 2;
        blockCounter += adr;
    } else {
        pos = -2;
    }

    let images: Array<MulImage> = [];
    while (blockCounter * MUL_BLOCK + 2 < dv.byteLength) {
        let imgNum = dv.getInt16(pos += 2, true);
        let byteSize = dv.getInt16(pos += 2, true);
        let xres = dv.getInt16(pos += 2, true);
        let yres = dv.getInt16(pos += 2, true);
        let zres = dv.getInt16(pos += 2, true);

        let year = dv.getInt16(pos += 2, true);
        let month = dv.getInt16(pos += 2, true);
        let day = dv.getInt16(pos += 2, true);
        let hour = dv.getInt16(pos += 2, true);
        let minute = dv.getInt16(pos += 2, true);
        let second = dv.getInt16(pos += 2, true);

        let xsize = dv.getInt16(pos += 2, true);
        let ysize = dv.getInt16(pos += 2, true);
        let xoffset = dv.getInt16(pos += 2, true);
        let yoffset = dv.getInt16(pos += 2, true);
        let zscale = dv.getInt16(pos += 2, true);
        let tilt = dv.getInt16(pos += 2, true);

        let speed = dv.getInt16(pos += 2, true);
        let bias = dv.getInt16(pos += 2, true);
        let current = dv.getInt16(pos += 2, true);

        let sample = "";
        for (let i = 0; i < 21; i++) {
            sample += String.fromCharCode(dv.getUint8(pos++));
        }

        let title = "";
        for (let i = 0; i < 21; i++) {
            title += String.fromCharCode(dv.getUint8(pos++));
        }

        // let sample = buffer.toString('utf8', pos += 1, pos += 20);
        // let title = buffer.toString('utf8', pos += 1, pos += 20);

        let postpr = dv.getInt16(pos += 2, true);
        let postd1 = dv.getInt16(pos += 2, true);
        let mode = dv.getInt16(pos += 2, true);
        let currfac = dv.getInt16(pos += 2, true);
        let numPointscans = dv.getInt16(pos += 2, true);
        let unitnr = dv.getInt16(pos += 2, true);
        let version = dv.getInt16(pos += 2, true);

        let spare48 = dv.getInt16(pos += 2, true);
        let spare49 = dv.getInt16(pos += 2, true);
        let spare50 = dv.getInt16(pos += 2, true);
        let spare51 = dv.getInt16(pos += 2, true);
        let spare52 = dv.getInt16(pos += 2, true);
        let spare53 = dv.getInt16(pos += 2, true);
        let spare54 = dv.getInt16(pos += 2, true);
        let spare55 = dv.getInt16(pos += 2, true);
        let spare56 = dv.getInt16(pos += 2, true);
        let spare57 = dv.getInt16(pos += 2, true);
        let spare58 = dv.getInt16(pos += 2, true);
        let spare59 = dv.getInt16(pos += 2, true);

        let gain = dv.getInt16(pos += 2, true);

        let spare61 = dv.getInt16(pos += 2, true);
        let spare62 = dv.getInt16(pos += 2, true);
        let spare63 = dv.getInt16(pos += 2, true);

        let imgData = new Float32Array(xres * yres);
        for (let i = 0; i < xres * yres; i++) {
            imgData[i] = dv.getInt16(pos += 2, true) * 0.1 / 1.36 * zscale /
                2000;
        }

        if (numPointscans > 0) {
            for (let i = 0; i < numPointscans; i++) {
                let psSize = dv.getInt16(pos += 2, true);
                let psType = dv.getInt16(pos += 2, true);
                let psTime4scan = dv.getInt16(pos += 2, true);
                let psMinv = dv.getInt16(pos += 2, true);
                let psMaxv = dv.getInt16(pos += 2, true);
                let psXpos = dv.getInt16(pos += 2, true);
                let psYpos = dv.getInt16(pos += 2, true);
                let psDz = dv.getInt16(pos += 2, true);
                let psDelay = dv.getInt16(pos += 2, true);
                let psVersion = dv.getInt16(pos += 2, true);
                let psIndenDelay = dv.getInt16(pos += 2, true);
                let psXposEnd = dv.getInt16(pos += 2, true);
                let psYposEnd = dv.getInt16(pos += 2, true);
                let psVtFw = dv.getInt16(pos += 2, true);
                let psItFw = dv.getInt16(pos += 2, true);
                let psVtBw = dv.getInt16(pos += 2, true);
                let psItBw = dv.getInt16(pos += 2, true);
                let psLScan = dv.getInt16(pos += 2, true);

                pos += 92;
                let psData = [];
                for (let j = 0; j < psSize * 2; j += 2) {
                    psData.push(dv.getInt16(pos += 2));
                }
            }
        }
        blockCounter += byteSize;

        speed *= 0.01; // in seconds
        let lineTime = speed / yres; // in seconds
        bias = -bias / 3.2768;
        current *= currfac * 0.01;

        const imgID = "";
        images.push(
            new MulImage(
                imgNum,
                imgID,
                byteSize,
                xres,
                yres,
                zres,
                new Date(year, month - 1, day, hour, minute, second),
                xsize,
                ysize,
                xoffset,
                yoffset,
                zscale,
                tilt,
                speed,
                lineTime,
                bias,
                current,
                sample,
                title,
                postpr,
                postd1,
                mode,
                currfac,
                numPointscans,
                unitnr,
                version,
                gain,
                imgData,
            ),
        );
    }
    return images;
}
