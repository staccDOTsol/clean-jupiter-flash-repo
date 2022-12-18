"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOrca = exports._loadOrca = void 0;
const sdk_1 = require("@orca-so/sdk");
function _loadOrca(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i].pool;
            const tokenA = pool.getTokenA();
            const tokenB = pool.getTokenB();
            accounts.push({ account: tokenA.addr, provider: "orca" });
            accounts.push({ account: tokenB.addr, provider: "orca" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadOrca = _loadOrca;
function loadOrca(liquidity, results) {
    var _a, _b;
    try {
        if (!liquidity || liquidity.length == 0 || !results)
            return {};
        let orcaPools = {};
        let ind = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i].pool;
            const tokenA = pool.getTokenA();
            const tokenB = pool.getTokenB();
            let accountInfos = [results[2 * ind], results[2 * ind + 1]];
            let aTokenAmount = (_a = (0, sdk_1.deserializeAccount)(accountInfos[0].account.data)) === null || _a === void 0 ? void 0 : _a.amount;
            let bTokenAmount = (_b = (0, sdk_1.deserializeAccount)(accountInfos[1].account.data)) === null || _b === void 0 ? void 0 : _b.amount;
            aTokenAmount = parseFloat(aTokenAmount === null || aTokenAmount === void 0 ? void 0 : aTokenAmount.toString());
            bTokenAmount = parseFloat(bTokenAmount === null || bTokenAmount === void 0 ? void 0 : bTokenAmount.toString());
            orcaPools[pool.poolParams.address.toBase58()] = {
                pool: pool,
                tokenA: tokenA,
                tokenB: tokenB,
                aTokenAmount: aTokenAmount,
                bTokenAmount: bTokenAmount,
            };
            ind = ind + 1;
        }
        return orcaPools;
    }
    catch (_c) {
        return {};
    }
}
exports.loadOrca = loadOrca;
