import { assert, describe, expect, it } from 'vitest'
import fs from "fs";
import Vamas from "../src/vamas";

const file = fs.readFileSync("./tests/test_files/aes_staib.vms", "utf8");
const v = new Vamas(file);

describe('VAMAS Header', () => {
    const header = v.header;

    it('Institution Identifier', () => {
        assert.equal(header.institutionIdentifier, "Not Specified")
    })

    it('bar', () => {
        assert.equal(header.instrumentModelIdentifier, "Staib SuperCMA")
    })

    it('snapshot', () => {
        expect({ foo: 'bar' }).toMatchSnapshot()
    })
})
