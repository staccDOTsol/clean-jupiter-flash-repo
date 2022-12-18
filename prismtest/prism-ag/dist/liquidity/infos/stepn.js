"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadStepn = exports._loadStepn = void 0;
const sdk_1 = require("@orca-so/sdk");
function _loadStepn(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            const tokenA = pool.tokenAccountA;
            const tokenB = pool.tokenAccountB;
            accounts.push({ account: tokenA, provider: "stepn" });
            accounts.push({ account: tokenB, provider: "stepn" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadStepn = _loadStepn;
function loadStepn(liquidity, results) {
    var _a, _b;
    try {
        if (!liquidity || liquidity.length == 0 || !results)
            return {};
        let stepnPools = {};
        let ind = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            const tokenA = pool.tokenAccountA;
            const tokenB = pool.tokenAccountB;
            let accountInfos = [results[2 * ind].account, results[2 * ind + 1].account];
            let aTokenAmount = (_a = (0, sdk_1.deserializeAccount)(accountInfos[0].data)) === null || _a === void 0 ? void 0 : _a.amount;
            let bTokenAmount = (_b = (0, sdk_1.deserializeAccount)(accountInfos[1].data)) === null || _b === void 0 ? void 0 : _b.amount;
            aTokenAmount = parseFloat(aTokenAmount === null || aTokenAmount === void 0 ? void 0 : aTokenAmount.toString());
            bTokenAmount = parseFloat(bTokenAmount === null || bTokenAmount === void 0 ? void 0 : bTokenAmount.toString());
            stepnPools[pool.swapAccount] = Object.assign(Object.assign({}, pool), { tokenA: tokenA, tokenB: tokenB, aTokenAmount: aTokenAmount, bTokenAmount: bTokenAmount });
            ind = ind + 1;
        }
        return stepnPools;
    }
    catch (_c) {
        return {};
    }
}
exports.loadStepn = loadStepn;
