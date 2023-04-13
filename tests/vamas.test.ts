import { assert, describe, expect, it } from 'vitest'
import fs from "fs";
import { Vamas } from "../src/vamas";

const file = fs.readFileSync("./tests/test_files/aes_staib.vms", "utf8");
const v = new Vamas(file);

describe("VAMAS Header for Staib AES", () => {
    const header = v.header;

    it("Institution Identifier", () => {
        assert.equal(header.institutionIdentifier, "Not Specified")
    })

    it("Instrument Model Identifier", () => {
        assert.equal(header.instrumentModelIdentifier, "Staib SuperCMA")
    })

    it("Number of comment lines", () => {
        assert.equal(header.numLinesComment, 1)
    })

    it("Comment", () => {
        assert.equal(header.comment, "WinSpectro DAQ")
    })

    it("Experiment Mode", () => {
        assert.equal(header.experimentMode, "NORM")
    })

    it("Scan Mode", () => {
        assert.equal(header.scanMode, "REGULAR")
    })

    it("Number of spectral regions", () => {
        assert.equal(header.numSpectralRegions, 1)
    })

    it("Number of blocks", () => {
        assert.equal(header.numBlocks, 1)
    })
})

describe("VAMAS Blocks for Staib AES", () => {
    const block = v.blocks[0];

    it("Block identifier", () => {
        assert.equal(block.blockIdentifier, "1st block id")
    })

    it("Sample identifier", () => {
        assert.equal(block.sampleIdentifier, "1st sample id")
    })

    it("Year", () => {
        assert.equal(block.year, 2022)
    })

    it("Month", () => {
        assert.equal(block.month, 5)
    })

    it("Day", () => {
        assert.equal(block.day, 26)
    })

    it("Hour", () => {
        assert.equal(block.hour, 15)
    })

    it("Minute", () => {
        assert.equal(block.minute, 0)
    })

    it("Second", () => {
        assert.equal(block.second, 46)
    })

    it("Technique", () => {
        assert.equal(block.technique, "AES diff")
    })

    it("Analyzer Mode", () => {
        assert.equal(block.analyzerMode, "FAT")
    })

    it("Charge of detected particles", () => {
        assert.equal(block.chargeDetectedParticle, -1)
    })

    it("X label", () => {
        assert.equal(block.xLabel, "Kinetic Energy")
    })

    it("X units", () => {
        assert.equal(block.xUnits, "eV")
    })

    it("X start", () => {
        assert.equal(block.xStart, 19.989319)
    })

    it("X step", () => {
        assert.equal(block.xStep, 1.983673)
    })

    it("Number of corresponding variables", () => {
        assert.equal(block.numCorrespondingVariables, 1)
    })

    it("Signal collection time", () => {
        assert.equal(block.signalCollectionTime, 0.503)
    })

    it("Number of additional numeric parameters", () => {
        assert.equal(block.numAdditionalNumericalParams, 4)
    })

    it("Number of Y values", () => {
        assert.equal(block.numYValues, 1100)
    })
})

describe("VAMAS Block corresponding variables", () => {
    const corrVars = v.blocks[0].correspondingVariables[0]

    it("Label", () => {
        assert.equal(corrVars.label, "Intensity")
    })

    it("Unit", () => {
        assert.equal(corrVars.unit, "d")
    })

    it("Y Minimum", () => {
        assert.equal(corrVars.yMin, -3423633)
    })

    it("Y Maximum", () => {
        assert.equal(corrVars.yMax, 99886)
    })

    it("Number of data points", () => {
        assert.equal(corrVars.yValues.length, v.blocks[0].numYValues)
    })
})

describe("VAMAS Block additional numberical parameters", () => {
    const addNumParams = v.blocks[0].additionalNumericalParams

    it("Labels", () => {
        assert.equal(addNumParams[0].label, "BKSrettime")
        assert.equal(addNumParams[1].label, "BKSsamples")
        assert.equal(addNumParams[2].label, "BKSresomode")
        assert.equal(addNumParams[3].label, "BKSresol")
    })

    it("Value", () => {
        assert.equal(addNumParams[0].value, 5000)
        assert.equal(addNumParams[1].value, 20120)
        assert.equal(addNumParams[2].value, 1)
        assert.equal(addNumParams[3].value, 1)
    })

    it("Units", () => {
        addNumParams.forEach(p => assert.equal(p.unit, "n"))
    })
})
