import Slider from "@mui/material/Slider";

import { useStore } from "../../stores/store";

const MIN_DISTANCE = 1;

export default function NormalizationSlider() {
    const aesFiles = useStore((state) => state.aesFiles);
    const setNormalize = useStore((state) => state.setNormalize);
    const [normRange, setNormRange] = useStore(
        (state) => [state.normRange, state.setNormRange],
    );

    const xMin = Math.min(...aesFiles.map((af) => Math.min(...af.xData)));
    const xMax = Math.max(...aesFiles.map((af) => Math.max(...af.xData)));

    const handleSliderChange = (
        _: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < MIN_DISTANCE) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], xMax - MIN_DISTANCE);
                setNormRange([clamped, clamped + MIN_DISTANCE]);
            } else {
                const clamped = Math.max(newValue[1], MIN_DISTANCE);
                setNormRange([clamped - MIN_DISTANCE, clamped]);
            }
        } else {
            setNormRange(newValue as [number, number]);
        }
    };

    const handleMinInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            const newValue: [number, number] = [
                Number(event.target.value),
                normRange[1],
            ];
            setNormRange(newValue);
        }
    };

    const handleMaxInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            const newValue: [number, number] = [
                normRange[0],
                Number(event.target.value),
            ];
            setNormRange(newValue);
        }
    };

    const handleNormalizeCheckbox = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        event.target.checked ? setNormalize(true) : setNormalize(false);
        if (normRange[0] === 0 && normRange[1] === 0) {
            const maxE = Math.max(...aesFiles.map((af) => {
                return af.xData[af.xData.length - 1];
            }));
            setNormRange([maxE * 0.95, maxE]);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
                <input type="checkbox" onChange={handleNormalizeCheckbox} />
                <p>Normalize for range</p>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="number"
                    value={normRange[0]}
                    onChange={handleMinInput}
                    min={xMin}
                    max={xMax}
                    step="0.1"
                    style={{ width: "60px" }}
                />
                <input
                    type="number"
                    value={normRange[1]}
                    onChange={handleMaxInput}
                    min={xMin}
                    max={xMax}
                    step="0.1"
                    style={{ width: "60px", marginRight: "15px" }}
                />
                <Slider
                    style={{ width: "30vw" }}
                    min={xMin}
                    max={xMax}
                    value={normRange}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    disableSwap
                />
            </div>
        </div>
    );
}
