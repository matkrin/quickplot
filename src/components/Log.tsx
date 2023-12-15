import { Config, Data, Layout, LayoutAxis } from "plotly.js";
import Plot from "react-plotly.js";
import { LogFile } from "../logfile";
import { useStore } from "../stores/store";

export default function Log(): JSX.Element {
    const logFiles = useStore((state) => state.logFiles);

    return (
        <>
            {logFiles.map((logFile) => <LogFilePlot logFile={logFile} />)}
        </>
    );
}

function LogFilePlot(props: { logFile: LogFile }): JSX.Element {
    const logFile = props.logFile;

    const pStmChamberTrace: Partial<Data> = {
        x: logFile.datetimes,
        y: logFile.pStmChamber,
        name: "p<sub>STM Chamber</sub>",
    };
    const pPrepChamberTrace = {
        x: logFile.datetimes,
        y: logFile.pPrepChamber,
        yaxis: "y2",
        name: "p<sub>Prep Chamber</sub>",
    };
    const pStmInletTrace = {
        x: logFile.datetimes,
        y: logFile.pStmInlet,
        yaxis: "y3",
        name: "p<sub>STM Inlet</sub>",
    };
    const tempSampleTrace = {
        x: logFile.datetimes,
        y: logFile.tempSample,
        yaxis: "y4",
        name: "T<sub>sample<sub>",
    };

    const data = [
        pStmChamberTrace,
        pPrepChamberTrace,
        pStmInletTrace,
        tempSampleTrace,
    ];

    const yaxisLayout: Partial<LayoutAxis> = {
        // title: "",
        title: {
            text: "",
            standoff: 12,
        },
        // showline: true,
        // ticks: "outside",
        // mirror: true,
        // linewidth: 2,
        // tickwidth: 2,
        griddash: "dot",
        linecolor: "black",
        tickcolor: "black",
        tickfont: {
            size: 14,
        },
        zeroline: false,
        exponentformat: "power",
        automargin: true,
    };

    const layout: Partial<Layout> = {
        grid: {
            rows: 4,
            columns: 1,
            ygap: 0.1,
        },

        xaxis: {
            title: {
                text: "Time",
                font: {
                    size: 18,
                },
                // standoff: 12,
            },
            // showline: true,
            // ticks: "outside",
            // mirror: true,
            // linewidth: 2,
            // tickwidth: 2,
            griddash: "dot",
            // linecolor: "black",
            // tickcolor: "black",
            tickfont: {
                size: 14,
            },
        },
        yaxis: { ...yaxisLayout, title: "p<sub>STM Chamber</sub>"},
        yaxis2: { ...yaxisLayout, title: "p<sub>Prep Chamber</sub>" },
        yaxis3: { ...yaxisLayout, title: "p<sub>STM Inlet</sub>" },
        yaxis4: { ...yaxisLayout, title: "T<sub>Sample</sub>" },
        title: {
            text: `${logFile.filename}`,
            font: {
                size: 22,
            },
        },
    };

    const config: Partial<Config> = {
        displaylogo: false,
    };

    return (
        <>
            <Plot
                style={{
                    width: "90vw",
                    height: "100vh",
                    position: "relative",
                    display: "inline-block",
                }}
                data={data}
                layout={layout}
                useResizeHandler={true}
                config={config}
            />
        </>
    );
}
