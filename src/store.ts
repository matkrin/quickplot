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
                newFiles.sort((a, b) => {
                    return a.datetime < b.datetime ? -1 : 1;
                });
                return { aesFiles: [...state.aesFiles, ...newFiles] };
            });
        },
    };
});
