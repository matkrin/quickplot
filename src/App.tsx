import "./App.css";
import { useStore } from "./stores/store";
import FullWindowDropzone from "./components/FullWindowDropzone";
import Aes from "./components/Aes/Aes";
import Mul from "./components/Mul/Mul";
import Log from "./components/Log";

function App() {
    const aesFiles = useStore((state) => state.aesFiles);
    const mulFiles = useStore((state) => state.mulFiles);
    const logFiles = useStore((state) => state.logFiles);

    return (
        <FullWindowDropzone>
            <div className="App">
                {aesFiles.length > 0 && <Aes />}
                {mulFiles.length > 0 && <Mul />}
                {logFiles.length > 0 && <Log />}
            </div>
        </FullWindowDropzone>
    );
}

export default App;
