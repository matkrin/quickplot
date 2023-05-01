import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useStore } from "../store";
import { AesStaib } from "../vamas";

type DropzoneProps = {
    children: JSX.Element;
};

export default function FullWindowDropzone(props: DropzoneProps): JSX.Element {
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
