import Papa from "papaparse";

const LOCAL_DATE = "Local Date";
const LOCAL_TIME = "Local Time of Day";
const P_STM_CHAMBER = "Pressure [mbar] (JEVAmet VCU - Analysis SPM)";
const P_PREP_CHAMBER = "p prep chamber [mbar] (p/T via Labview)";
const P_STM_INLET = "p STM inlet [mbar] (p/T via Labview)";
const T_SAMPLE = "T STM sample [K] (p/T via Labview)";
const P_BARATRON_IN = "p baratron inlet [mbar] (p/T via Labview)"
const P_BARATRON_OUT = "p baratron outlet [mbar] (p/T via Labview)"
const I_STM_FILAMENT = "I STM heater [A] (p/T via Labview)"

//"Pressure [mbar] (JEVAmet VCU - Analysis SPM)";"p prep chamber [mbar] (p/T via Labview)";"p STM inlet [mbar] (p/T via Labview)";"T STM sample [K] (p/T via Labview)"
export class LogFile {
    datetimes: Array<Date>;
    pStmChamber: Array<number>;
    pPrepChamber: Array<number>;
    pStmInlet: Array<number>;
    tempSample: Array<number>;
    pBaratronIn: Array<number>;
    pBaratronOut: Array<number>;
    iStmFilament: Array<number>;
    filename: string;

    constructor(fileContent: string) {
        this.datetimes = [];
        this.pStmChamber = [];
        this.pPrepChamber = [];
        this.pStmInlet = [];
        this.tempSample = [];
        this.pBaratronIn = [];
        this.pBaratronOut = [];
        this.iStmFilament = [];
        this.filename = "";
        this.parseCsv(fileContent);
    }

    parseCsv(fileContent: string) {
        const parsed = Papa.parse(fileContent, { header: true });
        const data = parsed.data as { [key: string]: string }[];

        for (let i = 0; i < data.length; ++i) {
            const date = data[i][LOCAL_DATE];
            const time = data[i][LOCAL_TIME];
            try {
                this.datetimes[i] = new Date(`${date}T${time}`);
            } catch (err) {
                console.error(
                    `No entry for "${LOCAL_DATE}" and "${LOCAL_TIME}`,
                    err,
                );
            }

            try {
                this.pStmChamber[i] = Number.parseFloat(data[i][P_STM_CHAMBER]);
            } catch (err) {
                console.error(`No entry for "${P_STM_CHAMBER}" found`, err);
            }

            try {
                this.pPrepChamber[i] = Number.parseFloat(
                    data[i][P_PREP_CHAMBER],
                );
            } catch (err) {
                console.error(`No entry for "${P_PREP_CHAMBER}" found`, err);
            }

            try {
                this.pStmInlet[i] = Number.parseFloat(data[i][P_STM_INLET]);
            } catch (err) {
                console.error(`No entry for "${P_STM_INLET}" found`, err);
            }

            try {
                this.tempSample[i] = Number.parseFloat(data[i][T_SAMPLE]);
            } catch (err) {
                console.error(`No entry for "${T_SAMPLE}" found`, err);
            }

            try {
                this.pBaratronIn[i] = Number.parseFloat(data[i][P_BARATRON_IN]);
            } catch (err) {
                console.error(`No entry for "${P_BARATRON_IN}" found`, err);
            }

            try {
                this.pBaratronOut[i] = Number.parseFloat(data[i][P_BARATRON_OUT]);
            } catch (err) {
                console.error(`No entry for "${P_BARATRON_OUT}" found`, err);
            }

            try {
                this.iStmFilament[i] = Number.parseFloat(data[i][I_STM_FILAMENT]);
            } catch (err) {
                console.error(`No entry for "${I_STM_FILAMENT}" found`, err);
            }
        }
    }

    setFilename(filename: string) {
        this.filename = filename;
    }
}
