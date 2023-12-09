import { MulImage, parseMul } from "./parse";

export class Mul {
    imgs: Array<MulImage>;

    constructor(buffer: ArrayBuffer) {
        this.imgs = parseMul(buffer);
    }
}
