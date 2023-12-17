import { MulImage } from "../../mulfile/parse";
import { useStore } from "../../stores/store";
import StmImage from "./StmImageCanvas";

export default function Mul(): JSX.Element {
    const mulFiles = useStore((state) => state.mulFiles);
    const logFiles = useStore((state) => state.logFiles);
    const openLightbox = useStore((state) => state.openLightbox);

    if (logFiles.length > 0) {
        for (let logfile of logFiles) {
            mulFiles.forEach((mf) => mf.extractLogFile(logfile));
        }
    }

    return (
        <div style={{ paddingLeft: "20px" }}>
            {mulFiles.map((mulfile) => {
                return (
                    <div key={mulfile.filename}>
                        <h2 key={mulfile.filename} id={mulfile.filename}>
                            {mulfile.filename}
                        </h2>
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {mulfile.imgs.map((img) => (
                                <StmImageEntry
                                    key={img.imgID}
                                    mulImage={img}
                                    onClick={() => openLightbox(img)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

type StmImageEntryProps = {
    mulImage: MulImage;
    onClick: () => void;
};

function StmImageEntry(props: StmImageEntryProps): JSX.Element {
    const { mulImage } = props;
    const filename = mulImage.imgID.split("_").slice(0, -1).join("_");
    return (
        <div className="stm-image" onClick={props.onClick}>
            <StmImage
                mulImage={mulImage}
                width={`${mulImage.xres / 2}px`}
                height={`${mulImage.yres / 2}px`}
            />
            <span>
                {filename}
                <strong>{` #${mulImage.imgNum}`}</strong>
            </span>
            <span>{mulImage.title}</span>
        </div>
    );
}
