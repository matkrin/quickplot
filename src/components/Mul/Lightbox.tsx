import { MulImage } from "../../mulfile/parse";
import { useStore } from "../../stores/store";
import { useMousetrap } from "../../useMousetrap";
import StmImage from "./StmImageCanvas";

export default function Lightbox(): JSX.Element {
    const mulFiles = useStore((state) => state.mulFiles);
    const selectedImage = useStore((state) => state.selectedImage);
    const setSelectedImage = useStore((state) => state.setSelectedImage);
    const isLightboxOpen = useStore((state) => state.isLightboxOpen);
    const closeLightbox = useStore((state) => state.closeLightbox);

    const prevImage = () => {
        const allImages = mulFiles.map((mf) => mf.imgs).flat();
        const currentIdx = allImages.indexOf(selectedImage!);
        const len = allImages.length;
        const nextIdx = currentIdx === 0 ? len - 1 : currentIdx - 1;
        setSelectedImage(allImages[nextIdx]);
    };

    const nextImage = () => {
        const allImages = mulFiles.map((mf) => mf.imgs).flat();
        const currentIdx = allImages.indexOf(selectedImage!);
        const len = allImages.length;
        const nextIdx = currentIdx === len - 1 ? 0 : currentIdx + 1;
        setSelectedImage(allImages[nextIdx]);
    };

    useMousetrap(["left", "h"], prevImage);
    useMousetrap(["right", "l"], nextImage);
    useMousetrap(["esc", "q"], closeLightbox);

    return (
        <div
            style={{
                display: isLightboxOpen ? "block" : "none",
                position: "fixed",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.80)",
                backdropFilter: "blur(20px)",
                zIndex: 1,
            }}
        >
            <button className="lightbox-btn-close" onClick={closeLightbox}>
                &times;
            </button>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <button onClick={prevImage} className="lightbox-btn-prev-next">
                    &#10094;
                </button>
                {selectedImage && (
                    <>
                        <StmImage
                            mulImage={selectedImage}
                            width="90vh"
                            height="90vh"
                        />
                        <StmImageMetaTable mulImage={selectedImage} />
                    </>
                )}
                <button onClick={nextImage} className="lightbox-btn-prev-next">
                    &#10095;
                </button>
            </div>
        </div>
    );
}

function StmImageMetaTable(props: { mulImage: MulImage }): JSX.Element {
    const { mulImage } = props;

    return (
        <table style={{ display: "block", color: "white" }}>
            <tbody>
                <tr>
                    <th>Image ID</th>
                    <td>{mulImage.imgID}</td>
                </tr>
                <tr>
                    <th>Datetime</th>
                    <td>{mulImage.datetime.toLocaleString()}</td>
                </tr>
                <tr>
                    <th>
                        <hr />
                    </th>
                </tr>
                <tr>
                    <th>
                        I<sub>tun</sub>
                    </th>
                    <td>{mulImage.current.toFixed(3)} nA</td>
                </tr>
                <tr>
                    <th>
                        U<sub>tun</sub>
                    </th>
                    <td>{mulImage.bias.toFixed(2)} mV</td>
                </tr>
                <tr>
                    <th>Scan Size</th>
                    <td>
                        {mulImage.xsize} &times; {mulImage.ysize} nm<sup>2</sup>
                    </td>
                </tr>
                <tr>
                    <th>Resolution</th>
                    <td>{mulImage.xres} &times; {mulImage.yres}</td>
                </tr>
                <tr>
                    <th>Rotation</th>
                    <td>{mulImage.tilt}°</td>
                </tr>
                <tr>
                    <th>Scan Duration</th>
                    <td>{mulImage.speed.toFixed(2)} s</td>
                </tr>
                <tr>
                    <th>Line Time</th>
                    <td>{(mulImage.lineTime * 1000).toFixed(2)} ms</td>
                </tr>
                <tr>
                    <th>Offset</th>
                    <td>{mulImage.xoffset} nm, {mulImage.yoffset} nm</td>
                </tr>
                <tr>
                    <th>Gain</th>
                    <td>{mulImage.gain}</td>
                </tr>
                <tr>
                    <th>Mode</th>
                    <td>{mulImage.mode}</td>
                </tr>
                <tr>
                    <th>
                        <hr />
                    </th>
                </tr>
                {/*<tr> <th>Sample</th> <td>{mulImage.sample}</td> </tr>*/}
                <tr>
                    <th>Title</th>
                    <td>{mulImage.title}</td>
                </tr>
                {mulImage.logFileData && (
                    <>
                        <tr>
                            <th>
                                p<sub>Inlet</sub>
                            </th>
                            <td>{mulImage.logFileData?.pStmInlet} mbar</td>
                        </tr>
                        <tr>
                            <th>
                                T<sub>sample</sub>
                            </th>
                            <td>{mulImage.logFileData?.tempSample} K</td>
                        </tr>
                    </>
                )}
            </tbody>
        </table>
    );
}
