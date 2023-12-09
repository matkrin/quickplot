import AesPlot from "./AesPlot";
import Normalization from "./Normalization";
import Smoothing from "./Smoothing";
import AesTable from "./AesTable";


export default function Aes(): JSX.Element {
    return (
        <>
            <AesPlot />
            <div
                style={{
                    width: "70vw",
                    position: "relative",
                    display: "inline-block",
                }}
            >
                <hr />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Normalization />
                    <Smoothing />
                </div>
                <hr style={{ marginTop: "20px" }} />
                <AesTable />
            </div>
        </>
    )
}
