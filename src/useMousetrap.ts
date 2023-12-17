import Mousetrap from "mousetrap";
import { useEffect, useRef } from "react";

type Keys = string | string[];
type Action = "keypress" | "keydown" | "keyup";
type Callback = (
    event: Mousetrap.ExtendedKeyboardEvent,
    combo: string,
) => unknown;

export function useMousetrap(keys: Keys, callback: Callback, action?: Action) {
    let callbackRef = useRef<Callback>(callback);
    callbackRef.current = callback;

    useEffect(() => {
            Mousetrap.bind(keys, (event, combo) => {
                if (typeof callbackRef.current === "function") {
                    callbackRef.current(event, combo);
                }
            }, action);

        return () => {
            if (keys !== null) {
                Mousetrap.unbind(keys);
            }
        };
    }, [keys]);
}
