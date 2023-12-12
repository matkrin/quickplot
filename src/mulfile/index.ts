import { MulImage, parseMul } from "./parse";

export class MulFile {
    imgs: Array<MulImage>;
    filename: string;

    constructor(buffer: ArrayBuffer) {
        this.imgs = parseMul(buffer);
        this.filename = "";
    }

    setFilename(filename: string): void {
        this.filename = filename;
        this.setImgIDs(filename);
    }

    private setImgIDs(filename: string): void {
        this.imgs.forEach((img) =>
            img.imgID = `${filename.split(".")[0]}_${img.imgNum}`
        );
    }
}
