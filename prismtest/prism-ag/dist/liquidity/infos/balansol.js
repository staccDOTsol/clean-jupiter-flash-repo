"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBalansol = exports._loadBalansol = void 0;
const web3_js_1 = require("@solana/web3.js");
const helper_1 = require("../providers/Balansol/helper");
function _loadBalansol(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            accounts.push({ account: new web3_js_1.PublicKey(pool.poolAddress), provider: "balansol" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadBalansol = _loadBalansol;
function loadBalansol(liquidity, results) {
    try {
        if (!liquidity || liquidity.length == 0 || !results)
            return {};
        let balansolPools = {};
        let ind = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            let poolData = helper_1.balansolCoder.decode('pool', results[i].account.data);
            let newPool = Object.assign(Object.assign(Object.assign({}, poolData), pool.params), { provider: "balansol", poolAddress: pool.poolAddress });
            balansolPools[pool.poolAddress] = newPool;
        }
        return balansolPools;
    }
    catch (e) {
        return {};
    }
}
exports.loadBalansol = loadBalansol;
