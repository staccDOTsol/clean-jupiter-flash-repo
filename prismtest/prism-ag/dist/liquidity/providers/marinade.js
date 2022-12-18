"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarinadePools = void 0;
const types_1 = require("../../types/types");
const marinade_1 = require("../infos/marinade");
function getMarinadePools() {
    let pools = {};
    pools[marinade_1.SOL_MINT] = [{ other: types_1.MSOL_MINT, provider: "marinade" }];
    pools[types_1.MSOL_MINT] = [{ other: marinade_1.SOL_MINT, provider: "marinade" }];
    return pools;
}
exports.getMarinadePools = getMarinadePools;
