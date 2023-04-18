import { VamasBlock, VamasHeader } from "./types";
import { parseVamas } from "./parse";
import * as _ from "lodash";

export class Vamas {
    header: VamasHeader;
    blocks: VamasBlock[];

    constructor(file: string) {
        ({ header: this.header, blocks: this.blocks } = parseVamas(file));
    }
}

export class AesStaib extends Vamas {
    xData: Array<number>;
    yData: Array<number>;
    eStart: number;
    eStop: number;
    eStep: number;

    constructor(file: string) {
        super(file);
        const data = this.blocks[0];
        this.yData = data.correspondingVariables[0].yValues;
        this.eStart = data.xStart;
        this.eStop = (data.xStep * data.numYValues + data.xStart) - data.xStep;
        this.eStep = data.xStep;
        this.xData = _.range(this.eStart, this.eStop + this.eStep, this.eStep);
    }
}
