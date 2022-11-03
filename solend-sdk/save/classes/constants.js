"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgramId = exports.SOLEND_BETA_PROGRAM_ID = exports.SOLEND_DEVNET_PROGRAM_ID = exports.SOLEND_PRODUCTION_PROGRAM_ID = exports.SLOTS_PER_YEAR = exports.U64_MAX = exports.WANG = exports.WAD = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.WAD = "1".concat(Array(18 + 1).join("0"));
exports.WANG = "1".concat(Array(36 + 1).join("0"));
exports.U64_MAX = "18446744073709551615";
exports.SLOTS_PER_YEAR = 63072000;
exports.SOLEND_PRODUCTION_PROGRAM_ID = new web3_js_1.PublicKey("E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa");
exports.SOLEND_DEVNET_PROGRAM_ID = new web3_js_1.PublicKey("ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx");
exports.SOLEND_BETA_PROGRAM_ID = new web3_js_1.PublicKey("BLendhFh4HGnycEDDFhbeFEUYLP4fXB5tTHMoTX8Dch5");
function getProgramId(environment) {
    switch (environment) {
        case "production":
            return exports.SOLEND_PRODUCTION_PROGRAM_ID;
            break;
        case "devnet":
            return exports.SOLEND_DEVNET_PROGRAM_ID;
            break;
        case "beta":
            return exports.SOLEND_BETA_PROGRAM_ID;
            break;
    }
    throw Error(`Unsupported environment: ${environment}`);
}
exports.getProgramId = getProgramId;
