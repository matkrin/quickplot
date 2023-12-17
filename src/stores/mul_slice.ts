import { StateCreator } from "zustand";
import { MulFile } from "../mulfile";
import { MulImage } from "../mulfile/parse";

export type MulSlice = {
    mulFiles: Array<MulFile>;
    selectedImage: MulImage | null;
    isLightboxOpen: boolean;
    setSelectedImage: (mulImage: MulImage) => void;
    addMulFile: (newFile: MulFile) => void;
    openLightbox: (mulImage: MulImage) => void;
    closeLightbox: () => void;
};

export const createMulSlice: StateCreator<MulSlice> = (set) => {
    return {
        mulFiles: [],
        selectedImage: null,
        isLightboxOpen: false,

        addMulFile: (newFile) => {
            set((state) => {
                return { mulFiles: [...state.mulFiles, newFile].sort((a, b) => {
                    return a.filename < b.filename ? -1 : 1;
                }) };
            });
        },

        setSelectedImage: (mulimage) => {
            set(() => {
                return { selectedImage: mulimage };
            })
        },

        openLightbox: (mulimage) => {
            set(() => {
                return { selectedImage: mulimage, isLightboxOpen: true }; 
            })
        },

        closeLightbox: () => {
                set(() => {
                    return { selectedImage: null, isLightboxOpen: false }
                })
            }
    };
};
