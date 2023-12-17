import { useEffect, useRef } from "react";
import { MulImage } from "../../mulfile/parse";

type StmImageProps = {
    mulImage: MulImage;
    width: string;
    height: string;
};

export default function StmImage(props: StmImageProps) {
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
        canvas.style.padding = "5px";

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.canvas.width = mulImage.xres;
        ctx.canvas.height = mulImage.yres;
        ctx.putImageData(imageData, 0, 0);

    }, [mulImage]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: props.width, height: props.height }}
        />
    );
}
