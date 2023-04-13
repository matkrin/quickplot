import { VamasBlock, VamasHeader } from "./types";
import { parseVamas } from "./parse";


export default class Vamas {
    header: VamasHeader;
    blocks: VamasBlock[];

    constructor(file: string) {
        ({ header: this.header, blocks: this.blocks } = parseVamas(file));
    }
}
