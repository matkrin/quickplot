import { useCallback, useState } from "react";
import "./App.css";
import { AesStaib } from "./vamas";
import { useDropzone } from "react-dropzone";
import Plot from "react-plotly.js";
import Plotly, { Config, Layout, PlotlyHTMLElement } from "plotly.js";
import { size } from "lodash";
import { useStore } from "./store";

type DropzoneProps = {
    children: JSX.Element;
};

function FullWindowDropzone(props: DropzoneProps) {
    const setAesFiles = useStore((state) => state.setAesFiles);

    const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
        const fileContents = await Promise.all(
            acceptedFiles.map((f) => f.text()),
        );
        const aesFiles = fileContents.map((fc) => new AesStaib(fc));
        aesFiles.forEach((f, i) =>
            f.setFilename(acceptedFiles[i].name.split(".")[0])
        );
        setAesFiles(aesFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
    });

    return (
        <div
            id="dropzone"
            style={{ width: "100vw", height: "100vh" }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            {isDragActive
                ? <p>Drop 'em</p>
                : <p>Drag file(s) or folder click</p>}
            <button onClick={open}>Browse</button>
            {props.children}
        </div>
    );
}

function AesPlot() {
    const aesFiles = useStore((state) => state.aesFiles);
    const yMin = Math.min(...aesFiles.map((af) => {
        return Math.min(...af.yData);
    }));
    const yMax = Math.max(...aesFiles.map((af) => {
        return Math.max(...af.yData);
    }));
    const [yRange, setYRange] = useStore((
        state,
    ) => [state.yRange, state.setYRange]);
    const [xRange, setXRange] = useStore((
        state,
    ) => [state.xRange, state.setXRange]);

    const layout: Partial<Layout> = {
        autosize: true,
        margin: {
            l: 80,
            r: 30,
            t: 30,
            b: 70,
        },
        xaxis: {
            range: xRange,
            title: {
                text: "E<sub>kin</sub> [eV]",
                font: {
                    size: 18,
                },
                standoff: 12,
            },
            showline: true,
            ticks: "outside",
            mirror: true,
            linewidth: 2,
            tickwidth: 2,
            griddash: "dot",
            linecolor: "black",
            tickcolor: "black",
            tickfont: {
                /* family: "Courier", */
                size: 14,
            },
            /* rangeselector: {}, */
            /* rangeslider: {}, */
        },
        yaxis: {
            range: yRange,
            title: {
                text: "dN / dE [arb. units]",
                font: {
                    size: 18,
                },
                standoff: 10,
            },
            showline: true,
            ticks: "outside",
            mirror: true,
            linewidth: 2,
            tickwidth: 2,
            griddash: "dot",
            linecolor: "black",
            tickcolor: "black",
            tickfont: {
                /* family: "Courier", */
                size: 14,
            },
            zeroline: false,
        },
    };

    function closestIndex(arr: number[], value: number) {
        const diffArr = arr.map((x) => Math.abs(value - x));
        const minNumber = Math.min(...diffArr);
        return diffArr.findIndex((x) => x === minNumber);
    }

    const config: Partial<Config> = {
        displaylogo: false,
        responsive: true,
        modeBarButtonsToAdd: [
            {
                title: "Autoscale Y-Axis",
                name: "autoscale_y_axis",
                icon: {
                    path:
                        "M 0,0 V 0 M 82.581766,17.30951 V 183.76279 L 105.27935,183.9573 104.98563,17.30951 Z M 27.574338,183.63362 H 155.0076 v 0 c 16.69408,0 30.22732,9.04382 30.22732,20.19994 0,11.15612 -13.53324,20.19994 -30.22732,20.19994 H 27.574338 v 0 c -16.694099,0 -30.2273392,-9.04382 -30.2273392,-20.19994 0,-11.15611 13.5332402,-20.19994 30.2273392,-20.19994 z M 27.497577,-22.073737 H 154.96436 v 0 c 16.69847,0 30.23528,8.966023 30.23528,20.0261744 0,11.0601481 -13.53681,20.0261746 -30.23528,20.0261746 H 27.497577 v 0 c -16.69849,0 -30.2352902,-8.9660255 -30.2352902,-20.0261746 0,-11.0601504 13.5368002,-20.0261744 30.2352902,-20.0261744 z",
                },
                click: (gd: PlotlyHTMLElement) => {
                    // @ts-ignore
                    const selectedXRange = gd.layout.xaxis.range;
                    setXRange(selectedXRange);
                    setYRange(selectedXRange);
                },
            },
        ],
    };

    const data = aesFiles.map((aes, i) => {
        let dash = "solid";
        if (i > 9) dash = "dash";
        return {
            x: aes.xData,
            y: aes.yData,
            mode: "lines",
            name: aes.filename,
            line: {
                dash: dash,
            },
        };
    });

    return (
        <Plot
            style={{
                width: "70vw",
                height: "75vh",
                position: "relative",
                display: "inline-block",
            }}
            data={data}
            layout={layout}
            useResizeHandler={true}
            config={config}
        />
    );
}

function App() {
    const aesFiles = useStore((state) => state.aesFiles);
    return (
        <FullWindowDropzone>
            <div className="App">
                {aesFiles.length > 0 && <AesPlot />}
            </div>
        </FullWindowDropzone>
    );
}

export default App;
