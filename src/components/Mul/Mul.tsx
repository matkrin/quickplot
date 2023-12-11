import { useEffect, useRef } from "react";
import { MulImage } from "../../mulfile/parse";
import { useStore } from "../../stores/store";

export default function Mul(): JSX.Element {
    const mulFiles = useStore((state) => state.mulFiles);

    return (
        <>
            {mulFiles.map((mul) => {
                return mul.imgs.map((mulImage) => {
                    return (
                        <StmImageCanvas
                            key={mulImage.imgNum}
                            mulImage={mulImage}
                        />
                    );
                });
            })}
        </>
    );
}

function StmImageCanvas(props: { mulImage: MulImage }) {
    const mulImage = props.mulImage;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        mulImage.process();
        console.log(mulImage.imgNum);
        console.log(mulImage.imgData.length);
        console.log(mulImage.xres);
        console.log(mulImage.yres);

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
