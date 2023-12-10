import { rocket } from "./rocket";

export class MulImage {
    constructor(
        public imgNum: number,
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
        public imgData: Uint16Array | Uint8ClampedArray,
    ) {}

    imgDataToUint8Clamped(colormap: string) {
        console.log(this.imgData.length > this.xres * this.yres);
        if (this.imgData.length > this.xres * this.yres) {
            return
        }
        const imageData = this.imgData as Uint16Array;
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
        const newArr = new Uint16Array(len);

        for (let i = len; i > 0; i -= this.yres) {
            const line = this.imgData.slice(i - this.yres, i);
            newArr.set(line, len - i);
        }
        this.imgData = newArr;
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

        // let imgData = []
        // for(let i = 0; i < yres; i++) {
        //     let line = []
        //     for(let j = 0; j < xres; j++) {
        //         let dataPoint = dv.getInt16(pos += 2, true);
        //         line.push(dataPoint);
        //     }
        //     imgData.push(line);
        // }
        let imgData = new Uint16Array(buffer, pos += 2, xres * yres);
        pos += xres * yres * 2 - 2;

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

        images.push(
            new MulImage(
                imgNum,
                byteSize,
                xres,
                yres,
                zres,
                new Date(year, month, day, hour, minute, second),
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
