import { create } from "zustand";
import { AesStaib } from "./vamas";

type Store = {
    aesFiles: Array<AesStaib>;
    xRange: Array<number>;
    yRange: Array<number>;
    isNormalize: boolean;
    normRange: [number, number];
    setAesFiles: (newFiles: Array<AesStaib>) => void;
    setXRange: (selectedXRange: Array<number>) => void;
    setYRange: (selectedXRange: Array<number>) => void;
    setNormalize: (newNormalize: boolean) => void;
    setNormRange: (newNormRange: [number, number]) => void;
};

export const useStore = create<Store>((set) => {
    return {
        aesFiles: [],
        xRange: [],
        yRange: [],
        isNormalize: false,
        normRange: [0, 0],

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

        setNormalize: (newNormalize: boolean) => {
            set(() => {
                return { isNormalize: newNormalize };
            });
        },

        setNormRange: (newNormRange: [number, number]) => {
            set(() => {
                return { normRange: newNormRange };
            });
        },
    };
});

function closestIndex(arr: number[], value: number): number {
    const diffArr = arr.map((x) => Math.abs(value - x));
    const minNumber = Math.min(...diffArr);
    return diffArr.findIndex((x) => x === minNumber);
}

function yMeanForXRange(
    xArr: number[],
    yArr: number[],
    xStart: number,
    xEnd: number,
): number {
    const startIndex = closestIndex(xArr, xStart);
    const endIndex = closestIndex(xArr, xEnd);
    const sliced = yArr.slice(startIndex, endIndex);
    return sliced.reduce((acc, x) => acc + x, 0) / sliced.length;
}

export function normalizeForRange(
    aesFiles: AesStaib[],
    normRange: [number, number],
): { xData: number[]; yData: number[] }[] {
    const meanFirst = yMeanForXRange(
        aesFiles[0].xData,
        aesFiles[0].yData,
        normRange[0],
        normRange[1],
    );
    return aesFiles.map((af) => {
        const mean = yMeanForXRange(
            af.xData,
            af.yData,
            normRange[0],
            normRange[1],
        );
        const f = meanFirst / mean;
        const normY = af.yData.map((n) => n * f);
        return { xData: af.xData, yData: normY };
    });
}
