import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MulFile } from "../mulfile";
import { useStore } from "../stores/store";
import { AesStaib } from "../vamas";

type DropzoneProps = {
    children: JSX.Element;
};

export default function FullWindowDropzone(props: DropzoneProps): JSX.Element {
    const addAesFile = useStore((state) => state.addAesFile);
    const addAesFiles = useStore((state) => state.addAesFiles);
    const addMulFile = useStore((state) => state.addMulFile);

    const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
        if (acceptedFiles.every((f) => f.name.endsWith(".vms"))) {
            const fileContents = await Promise.all(
                acceptedFiles.map((f) => f.text()),
            );
            const aesFiles = fileContents.map((fc) => new AesStaib(fc));
            aesFiles.forEach((f, i) =>
                f.setFilename(acceptedFiles[i].name.split(".")[0])
            );
            addAesFiles(aesFiles);
        } else {
            acceptedFiles.forEach(async (f) => {
                if (f.name.endsWith(".vms")) {
                    const fileContent = await f.text();
                    const aesFile = new AesStaib(fileContent);
                    aesFile.setFilename(f.name);
                    addAesFile(aesFile);
                } else if (f.name.endsWith(".mul") || f.name.endsWith(".flm")) {
                    const fileContent = await f.arrayBuffer();
                    const mulfile = new MulFile(fileContent);
                    mulfile.setFilename(f.name);
                    addMulFile(mulfile);
                }
            });
        }
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
            {isDragActive ? <p>Drop 'em</p> : <p>Drag file(s) or folder</p>}
            <button onClick={open}>Browse</button>
            {props.children}
        </div>
    );
}
