type LinescanCoordinates = {
    firstLinescanStartX: number;
    firstLinescanStartY: number;
    firstLinescanFinishX: number;
    firstLinescanFinishY: number;
    lastLinescanFinishX: number;
    lastLinescanFinishY: number;
};

type SputteringSource = {
    energy: number;
    beamCurrent: number;
    widthX: number;
    widthY: number;
    polarIncidenceAngle: number;
    azimuth: number;
    mode: string;
};

type CorrespondingVariable = {
    label: string;
    unit: string;
    yValues: Array<number>;
    yMin?: number;
    yMax?: number;
};

type AdditionalNumericalParam = {
    label: string;
    unit: string;
    value: number;
};

export type VamasBlock = {
    blockIdentifier: string;
    sampleIdentifier: string;

    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    numHoursAdvanceGmt: number;

    numLinesBlockComment: number;
    blockComment: string;

    technique: string;

    valuesExpVar: Array<string>;

    analysisSourceLabel: string;

    analysisSourceCharacteristicEnergy: number;
    analysisSourceStringength: number;
    analysisSourceBeamWidthX: number;
    analysisSourceBeamWidthY: number;

    analysisSourcePolarIncidenceAngle: number;
    analysisSourceAzimuth: number;

    analyzerMode: string;

    analyzerPassEnergyOrRetardRatioOrMassRes: number;

    magnificationAnalyzerTransferLens: number;
    analyzerWorkFunctionOrAcceptanceEnergy: number;

    targetBias: number;

    analysisWidthX: number;
    analysisWidthY: number;
    analyzerAxisTakeOffPolarAngle: number;
    analyzerAxisTakeOffAzimuth: number;

    speciesLabel: string;
    transitionOrChargeStateLabel: string;

    chargeDetectedParticle: number;

    xLabel: string;
    xUnits: string;
    xStart: number;
    xStep: number;

    numCorrespondingVariables: number;
    correspondingVariables: Array<CorrespondingVariable>;

    signalMode: string;
    signalCollectionTime: number;
    numScansToCompileBlock: number;
    signalTimeCorrection: number;

    sampleNormalPolarAngleTilt: number;
    sampleNormalTiltAzimuth: number;
    sampleRotationAngle: number;

    numAdditionalNumericalParams: number;
    additionalNumericalParams: Array<AdditionalNumericalParam>;

    numYValues: number;

    // Optional
    xCoord?: number;
    yCoord?: number;
    sputteringZ?: number;
    sputteringNumParticles?: number;
    sputteringCharge?: number;
    fieldViewX?: number;
    fieldViewY?: number;
    linescanCoordinates?: LinescanCoordinates;
    differentialWidth?: number;
    sputteringSource?: SputteringSource;
};

// Header
type ExperimentVariable = {
    label: string;
    unit: string;
};

type FutureUpgradeExperimentEntry = {
    label: string;
    unit: string;
};

export type VamasHeader = {
    formatIdentifier: string;
    institutionIdentifier: string;
    instrumentModelIdentifier: string;
    operatorIdentifier: string;
    experimentIdentifier: string;
    numLinesComment: number;
    comment?: string;
    experimentMode: string;
    scanMode: string;
    numExperimentVariables: number;
    numEntriesInclusionExclusion: number;
    blockParamsIncludes: Array<boolean>;
    numManuallyEnteredItemsInBlock: number;
    numFutureUpgradeExperimentEntries: number;
    numFutureUpgradeBlockEntries: number;
    numBlocks: number;

    // Optional-Sequences
    numSpectralRegions?: number;
    numAnalysisPositions?: number;
    numDiscreteXCoordsInFullMap?: number;
    numDiscreteYCoordsMnMullMap?: number;
    experimentVariables?: Array<ExperimentVariable>;
    futureUpgradeExperimentEntries?: Array<FutureUpgradeExperimentEntry>;
};
