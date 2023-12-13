import { useEffect, useRef } from "react";
import { MulImage } from "../../mulfile/parse";
import { useStore } from "../../stores/store";

export default function Mul(): JSX.Element {
    const mulFiles = useStore((state) => state.mulFiles);

    return (
        <div>
            {mulFiles.map((mulfile) => {
                return (
                    <>
                        <h2 key={mulfile.filename}>{mulfile.filename}</h2>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {mulfile.imgs.map((img) => (
                                <StmImage
                                    key={img.imgID}
                                    mulImage={img}
                                />
                            ))}
                        </div>
                    </>
                );
            })}
        </div>
    );
}

function StmImage(props: { mulImage: MulImage }): JSX.Element {
    const { mulImage } = props;
    const filename = mulImage.imgID.split("_").slice(0, -1).join("_");
    return (
        <div className="stm-image">
            <StmImageCanvas
                mulImage={mulImage}
            />
            <span>
                {mulImage.imgID.split("_").slice(0, -1).join("_")}{" "}
                <strong>{`#${mulImage.imgNum}`}</strong>
            </span>
            <span>{mulImage.title}</span>
            <span>{mulImage.datetime.toLocaleString()}</span>
        </div>
    );
}

function StmImageCanvas(props: { mulImage: MulImage }) {
    const mulImage = props.mulImage;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        mulImage.process();

        const imageData = new ImageData(
            mulImage.imgData as Uint8ClampedArray,
            mulImage.xres,
            mulImage.yres,
        );

        if (canvasRef.current == null) return;
        const canvas = canvasRef.current;
        canvas.style.width = `${mulImage.xres / 2}px`;
        canvas.style.height = `${mulImage.yres / 2}px`;
        canvas.style.padding = "5px";

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.canvas.width = mulImage.xres;
        ctx.canvas.height = mulImage.yres;

        ctx.putImageData(imageData, 0, 0);
    }, []);

    return <canvas ref={canvasRef} />;
}
