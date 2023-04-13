import { VamasBlock, VamasHeader } from "./types";


type VamasParseResult = {
    header: VamasHeader;
    blocks: Array<VamasBlock>;
};

export function parseVamas(file: string): VamasParseResult {
    let cursor = 0;

    let lines = file.split("\n");

    let h: any = {};
    h["formatIdentifier"] = lines[cursor++].trim();

    if (
        h.formatIdentifier !== "VAMAS Surface Chemical Analysis Standard " +
        "Data Transfer Format 1988 May 4"
    ) {
        throw Error("The file does not contain the correct vamas identifier");
    }

    h["institutionIdentifier"] = lines[cursor++].trim();
    h["instrumentModelIdentifier"] = lines[cursor++].trim();
    h["operatorIdentifier"] = lines[cursor++].trim();
    h["experimentIdentifier"] = lines[cursor++].trim();

    h["numLinesComment"] = parseInt(lines[cursor++]);
    let comments = [];
    for (let i = 0; i < h["numLinesComment"]; ++i) {
        comments.push(lines[cursor++].trim());
    }
    h["comment"] = comments.join("\n");

    h["experimentMode"] = lines[cursor++].trim();
    h["scanMode"] = lines[cursor++].trim();

    if (["MAP", "MAPD", "NORM", "SDP"].includes(h["experimentMode"])) {
        h["numSpectralRegions"] = parseInt(lines[cursor++].trim());
    }

    if (["MAP", "MAPD"].includes(h["experimentMode"])) {
        h["numAnalysisPositions"] = parseInt(lines[cursor++]);
        h["numDiscreteXCoordsInFullMap"] = parseInt(lines[cursor++]);
        h["numDiscreteYCoordsInFullMap"] = parseInt(lines[cursor++]);
    }

    h["numExperimentVariables"] = parseInt(lines[cursor++]);
    h["experimentVariables"] = [];
    for (let i = 0; i < h["numExperimentVariables"]; ++i) {
        h["experimentVariables"].push(
            { label: lines[cursor++].trim(), unit: lines[cursor++].trim() },
            //   ExperimentVariable(lines[cursor++].trim(), lines[cursor++].trim())
        );
    }

    h["numEntriesInclusionExclusion"] = parseInt(lines[cursor++]);
    h["blockParamsIncludes"] = [];
    for (let i = 0; i < 40; ++i) {
        h["blockParamsIncludes"][i] = h["numEntriesInclusionExclusion"] <= 0;
    }

    for (let i = 0; i < Math.abs(h["numEntriesInclusionExclusion"]); ++i) {
        h["blockParamsIncludes"][parseInt(lines[cursor++]) + 1] =
            h["numEntriesInclusionExclusion"] > 0;
    }

    h["numManuallyEnteredItemsInBlock"] = parseInt(lines[cursor++]);

    h["numFutureUpgradeExperimentEntries"] = parseInt(lines[cursor++]);

    h["futureUpgradeExperimentEntries"] = [];
    for (let i = 0; i < h["numFutureUpgradeExperimentEntries"]; ++i) {
        h["futureUpgradeExperimentEntries"].push(
            { "label": lines[cursor++].trim(), "unit": lines[cursor++].trim() },
            /* FutureUpgradeExperimentEntry(lines[cursor++].trim(), lines[cursor++].trim()) */
        );
    }

    if (h["numFutureUpgradeExperimentEntries"] != 0) {
        console.log("unsupported future upgrade experiment entries");
    }

    h["numFutureUpgradeBlockEntries"] = parseInt(lines[cursor++]);
    if (h["numFutureUpgradeBlockEntries"] != 0) {
        console.log("unsupported future block entries");
    }

    h["numBlocks"] = parseInt(lines[cursor++]);

    // End of header
    // console.log(h.get("blockParamsIncludes").length)

    const blocks: Array<VamasBlock> = [];
    for (let i = 0; i < h["numBlocks"]; ++i) {
        let include = blocks.length === 0
            ? [...new Array(40)].map((i) => i = true)
            : h["blockParamsIncludes"];
        // b = VamasBlock()
        // fb = VamasBlock()
        let b: any = {};
        let fb: any = {};

        b["blockIdentifier"] = lines[cursor++].trim();
        b["sampleIdentifier"] = lines[cursor++].trim();

        b["year"] = include[0] ? parseInt(lines[cursor++]) : fb["year"];
        b["month"] = include[1] ? parseInt(lines[cursor++]) : fb["month"];
        b["day"] = include[2] ? parseInt(lines[cursor++]) : fb["day"];
        b["hour"] = include[3] ? parseInt(lines[cursor++]) : fb["hour"];
        b["minute"] = include[4] ? parseInt(lines[cursor++]) : fb["minute"];
        b["second"] = include[5] ? parseInt(lines[cursor++]) : fb["second"];

        b["numHoursAdvanceGmt"] = include[6]
            ? parseFloat(lines[cursor++])
            : fb["num_hours_advance_gmt"];

        if (include[7]) {
            b["numLinesBlockComment"] = parseInt(lines[cursor++]);
            let block_comments = [];
            for (let i = 0; i < b["numLinesBlockComment"]; ++i) {
                block_comments.push(lines[cursor++].trim());
            }

            b["blockComment"] = block_comments.join("\n");
        } else {
            b["numLinesBlockComment"] = fb["numLinesBlockComment"];
            b["blockComment"] = fb["blockComment"];
        }
        b["technique"] = include[8] ? lines[cursor++].trim() : fb["technique"];

        if (["MAP", "MAPD"].includes(h["experimentMode"])) {
            b["xCoord"] = include[9] ? parseInt(lines[cursor++]) : fb["xCoord"];
            b["yCoord"] = include[10]
                ? parseInt(lines[cursor++])
                : fb["yCoord"];
        }

        if (include[10]) {
            b["valuesExpVar"] = [];
            for (let i = 0; i < h["experimentVariables"].length; ++i) {
                b["valuesExpVar"].push(lines[cursor++]);
            }
        } else {
            b["valuesExpVar"] = fb["valuesExpVar"];
        }

        b["analysisSourceLabel"] = include[11]
            ? lines[cursor++].trim()
            : fb["analysisSourceLabel"];

        if (
            ["MAPDP", "MAPSVDP", "SDP", "SDPSV"].includes(
                h["experimentMode"],
            ) ||
            [
                "SNMS energy spec",
                "FABMS",
                "FABMS energy spec",
                "ISS",
                "SIMS",
                "SIMS energy spec",
                "SNMS",
            ].includes(b["technique"])
        ) {
            b["sputteringZ"] = include[12]
                ? parseInt(lines[cursor++])
                : fb["sputteringZ"];
            b["sputteringNumParticles"] = include[12]
                ? parseFloat(lines[cursor++])
                : fb["sputteringNumParticles"];
            b["sputteringCharge"] = include[12]
                ? parseFloat(lines[cursor++].trim())
                : fb["sputteringCharge"];
        }

        b["analysisSourceCharacteristicEnergy"] = include[13]
            ? parseFloat(lines[cursor++])
            : fb["analysisSourceCharacteristicEnergy"];
        b["analysis_source_strength"] = include[14]
            ? parseFloat(lines[cursor++])
            : fb["analysisSourceStrength"];
        b["analysisSourceBeamWidthX"] = include[15]
            ? parseFloat(lines[cursor++])
            : fb["analysisSourceBeamWidthx"];
        b["analysis_source_beam_width_y"] = include[15]
            ? parseFloat(lines[cursor++])
            : fb["analysisSourceBeamWidthY"];

        if (
            ["MAP", "MAPDP", "MAPSV", "MAPSVDP", "SEM"].includes(
                h["experimentMode"],
            )
        ) {
            b["fieldViewX"] = include[16]
                ? parseFloat(lines[cursor++])
                : fb["fieldViewX"];
            b["fieldViewY"] = include[16]
                ? parseFloat(lines[cursor++])
                : fb["fieldViewY"];
        }

        if (["MAPSV", "MAPSVDP", "SEM"].includes(h["experimentMode"])) {
            if (include[17]) {
                b["linescanCoordinates"] = {
                    first_linescan_start_x: parseInt(lines[cursor++]),
                    first_linescan_start_y: parseInt(lines[cursor++]),
                    first_linescan_finish_x: parseInt(lines[cursor++]),
                    first_linescan_finish_y: parseInt(lines[cursor++]),
                    last_linescan_finish_x: parseInt(lines[cursor++]),
                    last_linescan_finish_y: parseInt(lines[cursor++]),
                };
            } else {
                b["linescanCoordinates"] = fb["linescanCoordinates"];
            }
        }

        b["analysisSourcePolarIncidenceAngle"] = include[18]
            ? parseFloat(lines[cursor++])
            : fb["analysisSourcePolarIncidenceAngle"];
        b["analysisSourceAzimuth"] = include[19]
            ? parseFloat(lines[cursor++])
            : fb["analysisSourceAzimuth"];
        b["analyzerMode"] = include[20]
            ? lines[cursor++].trim()
            : fb["analyzerMode"];

        b["analyzerPassEnergyOrRetardRatioOrMassRes"] = include[21]
            ? parseFloat(lines[cursor++])
            : fb["analyzerPassEnergyOrRetardRatioOrMassRes"];

        if (b["technique"] == "AES diff") {
            b["differentialWidth"] = include[22]
                ? parseFloat(lines[cursor++])
                : fb["differentialWidth"];
        }

        b["magnificationAnalyzerTransferLens"] = include[23]
            ? parseFloat(lines[cursor++])
            : fb["magnificationAnalyzerTransferLens"];
        b["analyzerWorkFunctionOrAcceptanceEnergy"] = include[24]
            ? parseFloat(lines[cursor++])
            : fb["analyzerWorkFunctionOrAcceptanceEnergy"];

        b["targetBias"] = include[25]
            ? parseFloat(lines[cursor++])
            : fb["targetBias"];

        b["analysisWidthX"] = include[26]
            ? parseFloat(lines[cursor++])
            : fb["analysisWidthX"];
        b["analysisWidthY"] = include[26]
            ? parseFloat(lines[cursor++])
            : fb["analysisWidthY"];

        b["analyzerAxisTakeOffPolarAngle"] = include[27]
            ? parseFloat(lines[cursor++])
            : fb["analyzerAxisTakeOffPolarAngle"];
        b["analyzerAxisTakeOffAzimuth"] = include[27]
            ? parseFloat(lines[cursor++])
            : fb["analyzerAxisTakeOffAzimuth"];

        b["speciesLabel"] = include[28]
            ? lines[cursor++].trim()
            : fb["speciesLabel"];

        b["transitionOrChargeStateLabel"] = include[29]
            ? lines[cursor++].trim()
            : fb["transitionOrChargeStateLabel"];
        b["charge_detected_particle"] = include[29]
            ? parseInt(lines[cursor++])
            : fb["chargeDetectedParticle"];

        if (h["scanMode"] !== "REGULAR") {
            console.log("Only REGULAR scans supported");
        }

        b["xLabel"] = include[30] ? lines[cursor++].trim() : fb["xLabel"];
        b["xUnits"] = include[30] ? lines[cursor++].trim() : fb["xUnits"];

        b["xStart"] = include[30] ? parseFloat(lines[cursor++]) : fb["xStart"];
        b["xStep"] = include[30] ? parseFloat(lines[cursor++]) : fb["xStep"];

        if (include[31]) {
            b["numCorrespondingVariables"] = parseInt(lines[cursor++]);
            b["correspondingVariables"] = [];
            /* for _ in range(b["num_corresponding_variables"]): */
            for (let i = 0; i < b["numCorrespondingVariables"]; ++i) {
                b["correspondingVariables"].push({
                    label: lines[cursor++].trim(),
                    unit: lines[cursor++].trim(),
                    y_values: [],
                });
            }
        } else {
            b["numCorrespondingVariables"] = fb["numCorrespondingVariables"];
            /* assert fb["corresponding_variables"] is not None */
            b["correspondingVariables"] = fb["correspondingVariables"].copy();
        }

        b["signalMode"] = include[32]
            ? lines[cursor++].trim()
            : fb["signalMode"];

        b["signalCollectionTime"] = include[33]
            ? parseFloat(lines[cursor++])
            : fb["signalCollectionTime"];

        b["numScansToCompileBlock"] = include[34]
            ? parseInt(lines[cursor++])
            : fb["numScansToCompileBlock"];

        b["signalTimeCorrection"] = include[35]
            ? parseFloat(lines[cursor++])
            : fb["signalTimeCorrection"];

        if (
            ["MAPDP", "MAPSVDP", "SDP", "SDPSV"].includes(
                h["experimentMode"],
            ) &&
            ["AES diff", "AES dir", "EDX", "ELS", "UPS", "XRF"].includes(
                b["technique"],
            )
        ) {
            if (include[36]) {
                b["sputteringSource"] = {
                    energy: parseFloat(lines[cursor++]),
                    beam_current: parseFloat(lines[cursor++]),
                    width_x: parseFloat(lines[cursor++]),
                    width_y: parseFloat(lines[cursor++]),
                    polar_incidence_angle: parseFloat(lines[cursor++]),
                    azimuth: parseFloat(lines[cursor++]),
                    mode: lines[cursor++].trim(),
                };
            } else {
                b["sputteringSource"] = fb["sputteringSource"];
            }
        }

        b["sampleNormalPolarAngleTilt"] = include[37]
            ? parseFloat(lines[cursor++])
            : fb["sampleNormalPolarAngleTilt"];

        b["sampleNormalTiltAzimuth"] = include[37]
            ? parseFloat(lines[cursor++])
            : fb["sampleNormalTiltAzimuth"];

        b["sampleRotationAngle"] = include[38]
            ? parseFloat(lines[cursor++])
            : fb["sampleRotationAngle"];

        if (include[39]) {
            b["numAdditionalNumericalParams"] = parseInt(lines[cursor++]);
            b["additionalNumericalParams"] = [];
            /* for _ in range(b["num_additional_numerical_params"]): */
            for (let i = 0; i < b["numAdditionalNumericalParams"]; ++i) {
                b["additionalNumericalParams"].push(
                    {
                        label: lines[cursor++].trim(),
                        unit: lines[cursor++].trim(),
                        value: parseFloat(lines[cursor++]),
                    },
                );
            }
        } else {
            b["numAdditionalNumericalParams"] =
                fb["numAdditionalNumericalParams"];
            b["additionalNumericalParams"] = fb["additionalNumericalParams"];
        }

        b["numYValues"] = parseInt(lines[cursor++]);

        for (let corres_var of b["correspondingVariables"]) {
            corres_var.y_min = parseFloat(lines[cursor++]);
            corres_var.y_max = parseFloat(lines[cursor++]);
        }

        /* for _ in range( parseInt(b["num_y_values"] / len(b["corresponding_variables"]))): */
        for (
            let i = 0;
            i <
            parseInt(b["numYValues"]) /
            b["correspondingVariables"].length;
            ++i
        ) {
            for (let corres_var of b["correspondingVariables"]) {
                corres_var.y_values.push(parseFloat(lines[cursor++]));
            }
        }

        blocks.push(b);
        fb = blocks[0];
    }
    return { header: h, blocks: blocks };
}
