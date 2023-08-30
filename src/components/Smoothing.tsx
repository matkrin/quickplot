import { useStore } from "../store";

export default function Smoothing(): JSX.Element {
    const setSmoothing = useStore(
        (state) => state.setSmoothing,
    );
    const [savitzkyGolayOpts, setSavitzkyGolayOpts] = useStore(
        (state) => [state.savitzkyGolayOpts, state.setSavitzkyGolayOpts],
    );

    let polyMax = 99;
    if (savitzkyGolayOpts.window === 5) {
        polyMax = 4;
    } else if (savitzkyGolayOpts.window === 7) {
        polyMax = 11;
    }

    const handleSmoothingCheckbox = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        event.target.checked ? setSmoothing(true) : setSmoothing(false);
    };

    const handleWindowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            const newSavGolOpts = {
                ...savitzkyGolayOpts,
                window: Number(event.target.value),
            };
            setSavitzkyGolayOpts(newSavGolOpts);
        }
    };

    const handlePolynomialChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.value !== "") {
            const newSavGolOpts = {
                ...savitzkyGolayOpts,
                polynomial: Number(event.target.value),
            };
            setSavitzkyGolayOpts(newSavGolOpts);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
                <input type="checkbox" onChange={handleSmoothingCheckbox} />
                <p>Savitzky-Golay</p>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ marginRight: "15px" }}>Window:</label>
                <input
                    type="number"
                    value={savitzkyGolayOpts.window}
                    onChange={handleWindowChange}
                    min={5}
                    // max={xMax}
                    step="2"
                    style={{ width: "40px", marginRight: "30px" }}
                />
                <label style={{ marginRight: "15px" }}>Polynomial:</label>
                <input
                    type="number"
                    value={savitzkyGolayOpts.polynomial}
                    onChange={handlePolynomialChange}
                    min={1}
                    max={polyMax}
                    step="1"
                    style={{ width: "40px", marginRight: "30px" }}
                />
            </div>
        </div>
    );
}
