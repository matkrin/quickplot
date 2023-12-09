import { Config, Layout, PlotlyHTMLElement } from "plotly.js";
import Plot from "react-plotly.js";
import { aesSavGol, normalizeForRange, useStore } from "../../store";
import { yAutoscaleIcon } from "./y_autoscale_icon";

export default function AesPlot() {
    const aesFiles = useStore((state) => state.aesFiles);
    const [yRange, setYRange] = useStore((
        state,
    ) => [state.yRange, state.setYRange]);
    const [xRange, setXRange] = useStore((
        state,
    ) => [state.xRange, state.setXRange]);
    const isNormalize = useStore((state) => state.isNormalize);
    const normRange = useStore((state) => state.normRange);

    const isSmoothing = useStore((state) => state.isSmoothing);
    const savitzkyGolayOpts = useStore((state) => state.savitzkyGolayOpts);

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

    const config: Partial<Config> = {
        displaylogo: false,
        responsive: true,
        modeBarButtonsToAdd: [
            {
                title: "Autoscale Y-Axis",
                name: "autoscale_y_axis",
                icon: yAutoscaleIcon,
                click: (gd: PlotlyHTMLElement) => {
                    // @ts-ignore: not included in interface
                    const selectedXRange = gd.layout.xaxis.range;
                    setXRange(selectedXRange);
                    setYRange(selectedXRange);
                },
            },
        ],
    };

    let plotData = aesFiles.map((af) => ({ xData: af.xData, yData: af.yData }));
    plotData = isNormalize ? normalizeForRange(plotData, normRange) : aesFiles;
    try {
        plotData = isSmoothing
            ? aesSavGol(plotData, savitzkyGolayOpts)
            : plotData;
    } catch (e) {
        console.log(e);
    }

    const data = aesFiles.map((aes, i) => {
        let dash = "solid";
        if (i > 9) dash = "dash";
        return {
            x: plotData[i].xData,
            y: plotData[i].yData,
            mode: "lines",
            name: aes.filename,
            line: {
                dash: dash,
            },
        };
    });

    return (
        <>
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
        </>
    );
}
