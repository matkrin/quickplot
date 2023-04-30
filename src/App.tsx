import { useCallback, useState } from "react";
import "./App.css";
import { AesStaib } from "./vamas";
import { useDropzone } from "react-dropzone";
import Plot from "react-plotly.js";
import Plotly, { Config, Layout, PlotlyHTMLElement } from "plotly.js";
import { size } from "lodash";
import { useStore } from "./store";
import { yAutoscaleIcon } from "./y_autoscale_icon";

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
                icon: yAutoscaleIcon,
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
