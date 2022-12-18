"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPenguin = exports._loadPenguin = void 0;
const sdk_1 = require("@orca-so/sdk");
const web3_js_1 = require("@solana/web3.js");
function _loadPenguin(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            const tokenA = new web3_js_1.PublicKey(pool.tokenAccountA);
            const tokenB = new web3_js_1.PublicKey(pool.tokenAccountB);
            accounts.push({ account: tokenA, provider: "penguin" });
            accounts.push({ account: tokenB, provider: "penguin" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadPenguin = _loadPenguin;
function loadPenguin(liquidity, results) {
    var _a, _b;
    try {
        if (!liquidity || liquidity.length == 0 || !results)
            return {};
        let penguinPools = {};
        let ind = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            const tokenA = new web3_js_1.PublicKey(pool.tokenAccountA);
            const tokenB = new web3_js_1.PublicKey(pool.tokenAccountB);
            let accountInfos = [results[2 * ind].account, results[2 * ind + 1].account];
            let aTokenAmount = (_a = (0, sdk_1.deserializeAccount)(accountInfos[0].data)) === null || _a === void 0 ? void 0 : _a.amount;
            let bTokenAmount = (_b = (0, sdk_1.deserializeAccount)(accountInfos[1].data)) === null || _b === void 0 ? void 0 : _b.amount;
            aTokenAmount = parseFloat(aTokenAmount === null || aTokenAmount === void 0 ? void 0 : aTokenAmount.toString());
            bTokenAmount = parseFloat(bTokenAmount === null || bTokenAmount === void 0 ? void 0 : bTokenAmount.toString());
            penguinPools[pool.swapAccount] = Object.assign(Object.assign({}, pool), { tokenA: tokenA, tokenB: tokenB, aTokenAmount: aTokenAmount, bTokenAmount: bTokenAmount });
            ind = ind + 1;
        }
        return penguinPools;
    }
    catch (_c) {
        return {};
    }
}
exports.loadPenguin = loadPenguin;
