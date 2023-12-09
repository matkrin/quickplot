import { StateCreator } from "zustand";
import { Mul } from "../mulfile";

export type MulSlice = {
    mulFiles: Array<Mul>;
    addMulFile: (newFile: Mul) => void;
};

export const createMulSlice: StateCreator<MulSlice> = (set) => {
    return {
        mulFiles: [],

        addMulFile: (newFile) => {
            set((state) => {
                return { mulFiles: [...state.mulFiles, newFile] };
            });
        },
    };
};
