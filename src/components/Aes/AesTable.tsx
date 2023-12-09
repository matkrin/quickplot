import { useStore } from "../../store";

const PLOT_COLORS = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
];

export default function AesTable(): JSX.Element {
    const [aesFiles, setAesFiles] = useStore(
        (state) => [state.aesFiles, state.setAesFiles],
    );

    const handleClick = (filename: string) => {
        const newAesFiles = aesFiles.filter((af) => af.filename !== filename);
        setAesFiles(newAesFiles);
    };

    const tableEntries = aesFiles.map((af, i) => {
        const color = PLOT_COLORS[i % 10];
        const line = i < 10 ? "―" : "- -";
        return (
            <tr key={af.filename}>
                <td style={{ color: color }}>
                    <strong style={{ fontSize: "60 px" }}>{line}</strong>
                </td>
                <td>{af.filename}</td>
                <td>
                    <button
                        onClick={() => handleClick(af.filename)}
                        className="x-btn"
                    >
                        &#10761;
                    </button>
                </td>
            </tr>
        );
    });

    return (
        <table>
            <thead>
                <tr>
                    <th colSpan={2}>Data</th>
                </tr>
            </thead>
            <tbody>
                {tableEntries}
            </tbody>
        </table>
    );
}
