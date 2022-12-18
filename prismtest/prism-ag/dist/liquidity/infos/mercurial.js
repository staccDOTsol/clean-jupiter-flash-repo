"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMercurial = exports._loadMercurial = void 0;
const sdk_1 = require("@orca-so/sdk");
function _loadMercurial(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            for (let j = 0; j < pool.tokenAccountsLength; j++) {
                accounts.push({ account: pool.tokenAccounts[j], provider: "mercurial" });
            }
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadMercurial = _loadMercurial;
function loadMercurial(liquidity, results) {
    var _a;
    try {
        if (!liquidity || liquidity.length == 0 || !results)
            return {};
        let mercurialPools = {};
        let ind = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            pool.tokenAmounts = [];
            for (let j = 0; j < pool.tokenAccountsLength; j++) {
                pool.tokenAmounts.push((_a = (0, sdk_1.deserializeAccount)(results[ind].account.data)) === null || _a === void 0 ? void 0 : _a.amount);
                ind++;
            }
            mercurialPools[pool.swapAccount] = pool;
        }
        return mercurialPools;
    }
    catch (_b) {
        return {};
    }
}
exports.loadMercurial = loadMercurial;
