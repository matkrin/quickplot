import { StateCreator } from "zustand";
import { LogFile } from "../logfile";

export type LogFileSlice = {
    logFiles: Array<LogFile>;
    addLogFile: (newFile: LogFile) => void;
};

export const createLogFileSlice: StateCreator<LogFileSlice> = (set) => {
    return {
        logFiles: [],

        addLogFile: (newFile: LogFile) => {
            set((state) => {
                return { logFiles: [...state.logFiles, newFile] };
            });
        },
    };
};
