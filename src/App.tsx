import "./App.css";
import { useStore } from "./store";
import FullWindowDropzone from "./components/FullWindowDropzone";
import AesPlot from "./components/AesPlot";
import NormalizationSlider from "./components/NormalizationSlider";
import Smoothing from "./components/Smoothing";

function App() {
    const aesFiles = useStore((state) => state.aesFiles);
    return (
        <FullWindowDropzone>
            <div className="App">
                {aesFiles.length > 0 &&
                    (
                        <>
                            <AesPlot />
                            <NormalizationSlider />
                            <Smoothing />
                        </>
                    )}
            </div>
        </FullWindowDropzone>
    );
}

export default App;
