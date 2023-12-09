import { create } from "zustand";
import { AesSlice, createAesSlice } from "./aes_slice";
import { createMulSlice, MulSlice } from "./mul_slice";

export const useStore = create<AesSlice & MulSlice>((...a) => {
    return {
        ...createMulSlice(...a),
        ...createAesSlice(...a),
    };
});
