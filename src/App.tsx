import "./App.css";
import { useStore } from "./store";
import FullWindowDropzone from "./components/FullWindowDropzone";
import Aes from "./components/Aes/Aes";

function App() {
    const aesFiles = useStore((state) => state.aesFiles);
    return (
        <FullWindowDropzone>
            <div className="App">
                {aesFiles.length > 0 && <Aes />}
            </div>
        </FullWindowDropzone>
    );
}

export default App;
