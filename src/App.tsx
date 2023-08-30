import "./App.css";
import { useStore } from "./store";
import FullWindowDropzone from "./components/FullWindowDropzone";
import AesPlot from "./components/AesPlot";
import Normalization from "./components/Normalization";
import Smoothing from "./components/Smoothing";
import AesTable from "./components/AesTable";

function App() {
    const aesFiles = useStore((state) => state.aesFiles);
    return (
        <FullWindowDropzone>
            <div className="App">
                {aesFiles.length > 0 &&
                    (
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
                    )}
            </div>
        </FullWindowDropzone>
    );
}

export default App;
