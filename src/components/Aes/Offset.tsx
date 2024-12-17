import { useStore } from "../../stores/store";
import RangeInput from "../RangeInput";


export default function Offset() {
    const setIsOffset = useStore((state) => state.setIsOffset);
    const [offsetRange, setOffsetRange] = useStore(
        (state) => [state.offsetRange, state.setOffsetRange],
    );

    return (
        <RangeInput
            label="Offset for range"
            setChecked={setIsOffset}
            range={offsetRange}
            setRange={setOffsetRange}
        />
    );
}
