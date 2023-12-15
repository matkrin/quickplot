import { create } from "zustand";
import { AesSlice, createAesSlice } from "./aes_slice";
import { createLogFileSlice, LogFileSlice } from "./logfile_slice";
import { createMulSlice, MulSlice } from "./mul_slice";

export const useStore = create<AesSlice & MulSlice & LogFileSlice>((...a) => {
    return {
        ...createMulSlice(...a),
        ...createAesSlice(...a),
        ...createLogFileSlice(...a),
    };
});
