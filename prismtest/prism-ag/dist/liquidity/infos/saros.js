"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSaros = exports._loadSaros = void 0;
const sdk_1 = require("@orca-so/sdk");
function _loadSaros(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            const tokenA = pool.tokenA;
            const tokenB = pool.tokenB;
            accounts.push({ account: tokenA, provider: "saros" });
            accounts.push({ account: tokenB, provider: "saros" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadSaros = _loadSaros;
function loadSaros(liquidity, results) {
    var _a, _b;
    try {
        if (!liquidity || liquidity.length == 0 || !results)
            return {};
        let sarosPools = {};
        let ind = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            const tokenA = pool.tokenA;
            const tokenB = pool.tokenB;
            let accountInfos = [results[2 * ind].account, results[2 * ind + 1].account];
            let aTokenAmount = (_a = (0, sdk_1.deserializeAccount)(accountInfos[0].data)) === null || _a === void 0 ? void 0 : _a.amount;
            let bTokenAmount = (_b = (0, sdk_1.deserializeAccount)(accountInfos[1].data)) === null || _b === void 0 ? void 0 : _b.amount;
            aTokenAmount = parseFloat(aTokenAmount === null || aTokenAmount === void 0 ? void 0 : aTokenAmount.toString());
            bTokenAmount = parseFloat(bTokenAmount === null || bTokenAmount === void 0 ? void 0 : bTokenAmount.toString());
            if (aTokenAmount == 0 || bTokenAmount == 0) {
                ind += 1;
                continue;
            }
            sarosPools[pool.swapAccount] = Object.assign(Object.assign({}, pool), { tokenA: tokenA, tokenB: tokenB, aTokenAmount: aTokenAmount, bTokenAmount: bTokenAmount });
            ind = ind + 1;
        }
        return sarosPools;
    }
    catch (_c) {
        return {};
    }
}
exports.loadSaros = loadSaros;
