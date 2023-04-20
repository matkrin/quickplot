import { ChangeEvent, useCallback, useState } from "react";
import "./App.css";
import { AesStaib } from "./vamas";
import { useDropzone } from "react-dropzone";
import Plot from "react-plotly.js";
import { Layout } from "plotly.js";
import { size } from "lodash";
import { useStore } from "./store";

type DropzoneProps = {
    children: JSX.Element;
};

function FullWindowDropzone(props: DropzoneProps) {
    const setAesFiles = useStore((state) => state.setAesFiles);

    const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
        /* console.log(acceptedFiles) */
        const fileContents = await Promise.all(
            acceptedFiles.map((f) => f.text()),
        );
        const aesFiles = fileContents.map((fc) => new AesStaib(fc));
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
                ? <p>Drop the files here...</p>
                : <p>Drag file or click</p>}
            <button onClick={open}>Browse</button>
            {props.children}
        </div>
    );
}

function AesPlot() {
    const aesFiles = useStore((state) => state.aesFiles);

    const layout: Partial<Layout> = {
        autosize: true,
        margin: {
            l: 90,
            r: 30,
            t: 30,
            b: 70,
        },
        xaxis: {
            title: {
                text: "x-Axis",
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
        },
        yaxis: {
            title: {
                text: "y-Axis even longer",
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
        },
    };
    /* const data = [{ x: new Float64Array([1, 2, 3, 16]), y: [2, 6, 3, 12], mode: "lines" }]; */
    const data = aesFiles.map((aes) => {
        return {
            x: aes.xData,
            y: aes.yData,
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
            config={{ displaylogo: false, responsive: true }}
        />
    );
}

function App() {
    const aesFiles = useStore((state) => state.aesFiles);
    return (
        <FullWindowDropzone>
            <div className="App">
                <p>Hello</p>
                {aesFiles.length > 0 && <AesPlot />}
            </div>
        </FullWindowDropzone>
    );
}

export default App;
