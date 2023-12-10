import "./App.css";
import { useStore } from "./stores/store";
import FullWindowDropzone from "./components/FullWindowDropzone";
import Aes from "./components/Aes/Aes";
import Mul from "./components/Mul/Mul";

function App() {
    const aesFiles = useStore((state) => state.aesFiles);
    const mulFiles = useStore((state) => state.mulFiles);

    return (
        <FullWindowDropzone>
            <div className="App">
                {aesFiles.length > 0 && <Aes />}
                {mulFiles.length > 0 && <Mul />}
            </div>
        </FullWindowDropzone>
    );
}

export default App;
