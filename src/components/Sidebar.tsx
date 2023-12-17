import { useState } from "react";
import { GitHub, Menu } from "react-feather";
import { LogFile } from "../logfile";
import { MulFile } from "../mulfile";
import { useStore } from "../stores/store";

export default function Sidebar(): JSX.Element {
    const aesFiles = useStore((state) => state.aesFiles);
    const mulFiles = useStore((state) => state.mulFiles);
    const logFiles = useStore((state) => state.logFiles);

    const [isOpen, setOpen] = useState(false);
    const width = isOpen ? "25%" : "0";

    const toggleSidebar = () => {
        setOpen(!isOpen);
    };

    const handleListClick = (file: MulFile | LogFile) => {
        const element = document.getElementById(file.filename);
        console.log(element);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <button className="menu-btn" onClick={toggleSidebar}>
                <Menu />
            </button>
            <div className="sidebar" style={{ width: width }}>
                <button className="github-btn">
                    <a
                        href="https://github.com/matkrin/quickplot"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHub />
                    </a>
                </button>
                <div className="sidebar-content">
                    {aesFiles.length > 0 && (
                        <ul>
                            <li>Auger Plot</li>
                        </ul>
                    )}
                    <ul>
                        {mulFiles.length > 0 &&
                            mulFiles.map((mulFile) => (
                                <li
                                    className="sidebar-li"
                                    key={mulFile.filename}
                                    onClick={() => handleListClick(mulFile)}
                                >
                                    {mulFile.filename}
                                </li>
                            ))}
                    </ul>
                    <ul>
                        {logFiles.length > 0 &&
                            logFiles.map((logFile) => (
                                <li
                                    className="sidebar-li"
                                    key={logFile.filename}
                                    onClick={() => handleListClick(logFile)}
                                >
                                    {logFile.filename}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
