import { useStore } from "../../stores/store";
import RangeInput from "../RangeInput";


export default function Normalization() {
    const setNormalize = useStore((state) => state.setNormalize);
    const [normRange, setNormRange] = useStore(
        (state) => [state.normRange, state.setNormRange],
    );

    return (
        <RangeInput
            label="Normalize for range"
            setChecked={setNormalize}
            range={normRange}
            setRange={setNormRange}
        />
    );
}
