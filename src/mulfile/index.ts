import { LogFile } from "../logfile";
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

    extractLogFile(logfile: LogFile): void {
        this.imgs.forEach((img) => {
            const datetimes = logfile.datetimes;
            const deltas = datetimes.map((dt) =>
                Math.abs(img.datetime.getTime() - dt.getTime())
            ).filter((x) => x);
            const minDelta = Math.min(...deltas);

            // logging in Prodigy should be at least every 2 seconds
            if (minDelta < 2000) {
                const minIdx = deltas.findIndex((x) => x === minDelta);
                img.logFileData = {
                    datetime: logfile.datetimes[minIdx],
                    pStmChamber: logfile.pStmChamber[minIdx],
                    pPrepChamber: logfile.pPrepChamber[minIdx],
                    pStmInlet: logfile.pStmInlet[minIdx],
                    tempSample: logfile.tempSample[minIdx],
                    pBaratronIn: logfile.pBaratronIn[minIdx],
                    pBaratronOut: logfile.pBaratronOut[minIdx],
                    iStmFilament: logfile.iStmFilament[minIdx],
                };
            }
        });
    }
}
