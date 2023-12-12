import { StateCreator } from "zustand";
import { MulFile } from "../mulfile";

export type MulSlice = {
    mulFiles: Array<MulFile>;
    addMulFile: (newFile: MulFile) => void;
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
