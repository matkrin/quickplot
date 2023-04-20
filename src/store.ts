import { create } from "zustand";
import { AesStaib } from "./vamas";

type Store = {
    aesFiles: Array<AesStaib>;
    setAesFiles: (newFiles: Array<AesStaib>) => void;
};

export const useStore = create<Store>((set) => {
    return {
        aesFiles: [],
        setAesFiles: (newFiles) => {
            set((state) => {
                return { aesFiles: [...state.aesFiles, ...newFiles] };
            });
        },
    };
});
