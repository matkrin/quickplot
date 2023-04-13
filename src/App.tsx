import { ChangeEvent, useCallback, useState } from 'react'
import './App.css'
import { AesStaib } from './vamas';
import { useDropzone } from "react-dropzone"

type DropzoneProps = {
    children: JSX.Element
}

function FullWindowDropzone(props: DropzoneProps) {
    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        console.log(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true });

    return (
        <div id="dropzone" style={{ width: "100vw", height: "100vh" }} {...getRootProps()} >
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the files here...</p> : <p> Drag file or click</p>}
            <button onClick={open}>TEST</button>
            {props.children}
        </div >
    )
}

function App() {
    async function handleInput(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            const fileContent = await event.target.files[0].text();
            const aes = new AesStaib(fileContent);
            console.log(aes)
        }
    }

    return (
        <FullWindowDropzone>
            <div className="App">
                {/* <div> */}
                {/*     <label htmlFor="load-file">Load a file:</label> */}
                {/*     <input type="file" id="load-file" onChange={(e) => handleInput(e)} /> */}
                {/* </div> */}
                <p>Hello</p>
                <button onClick={() => console.log("button click")}>TEST</button>
            </div>
        </ FullWindowDropzone>
    )
}

export default App
