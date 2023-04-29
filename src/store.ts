import { create } from "zustand";
import { AesStaib } from "./vamas";

type Store = {
    aesFiles: Array<AesStaib>;
    xRange: Array<number>;
    yRange: Array<number>;
    setAesFiles: (newFiles: Array<AesStaib>) => void;
    setXRange: (selectedXRange: Array<number>) => void;
    setYRange: (selectedXRange: Array<number>) => void;
};

export const useStore = create<Store>((set) => {
    return {
        aesFiles: [],
        xRange: [],
        yRange: [],

        setAesFiles: (newFiles) => {
            set((state) => {
                newFiles.sort((a, b) => {
                    return a.datetime < b.datetime ? -1 : 1;
                });
                return { aesFiles: [...state.aesFiles, ...newFiles] };
            });
        },

        setXRange: (currentXRange: Array<number>) => {
            set(() => {
                return { xRange: currentXRange };
            });
        },

        setYRange: (selectedXRange: Array<number>) => {
            set((state) => {
                const xStart = selectedXRange[0];
                const xEnd = selectedXRange[selectedXRange.length - 1];

                const yValuesArrays = state.aesFiles.map((af) => {
                    if (af.xData.some((n) => (n > xStart && n < xEnd))) {
                        const xStartIndex = closestIndex(af.xData, xStart);
                        const xEndIndex = closestIndex(af.xData, xEnd);
                        return af.yData.slice(xStartIndex, xEndIndex);
                    }
                }).filter((arr) => arr !== undefined);

                const yMin = Math.min(...yValuesArrays.flat() as number[]);
                const yMax = Math.max(...yValuesArrays.flat() as number[]);

                return {
                    yRange: [
                        yMin - Math.abs(yMin) * 0.05,
                        yMax + (Math.abs(yMin) * 0.05),
                    ],
                };
            });
        },
    };
});

function closestIndex(arr: number[], value: number) {
    const diffArr = arr.map((x) => Math.abs(value - x));
    const minNumber = Math.min(...diffArr);
    return diffArr.findIndex((x) => x === minNumber);
}
