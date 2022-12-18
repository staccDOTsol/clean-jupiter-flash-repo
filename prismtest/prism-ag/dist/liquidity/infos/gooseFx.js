"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGooseFx = exports._loadGooseFx = void 0;
function _loadGooseFx(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let quoters = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            quoters.push(pool.swap.getQuoterSync(pool.mints[0], pool.mints[1]));
            quoters.push(pool.swap.getQuoterSync(pool.mints[1], pool.mints[0]));
        }
        let accounts = [];
        for (let i = 0; i < quoters.length; i++) {
            let ac = quoters[i].getAccountsForUpdate(liquidity[Math.floor(i / 2)].parsedPairData);
            for (let j = 0; j < ac.length; j++)
                accounts.push({
                    account: ac[j],
                    provider: "gooseFX",
                });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadGooseFx = _loadGooseFx;
function loadGooseFx(liquidity, multipleInfo) {
    try {
        if (!liquidity || liquidity.length == 0 || !multipleInfo)
            return {};
        let gooseFxPools = {};
        let quoters = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            quoters.push(pool.swap.getQuoterSync(pool.mints[0], pool.mints[1]));
            quoters.push(pool.swap.getQuoterSync(pool.mints[1], pool.mints[0]));
        }
        let start = 0;
        for (let i = 0; i < quoters.length; i++) {
            let ac = quoters[i].getAccountsForUpdate(liquidity[Math.floor(i / 2)].parsedPairData);
            quoters[i].prepareSync(multipleInfo.slice(start, start + ac.length).map(x => x.account));
            start += ac.length;
        }
        let ind = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            gooseFxPools[pool.swapAccount] = Object.assign(Object.assign({}, pool), { quoter0: quoters[2 * i], quoter1: quoters[2 * i + 1], mintA: pool.mints[0].toBase58(), mintB: pool.mints[1].toBase58() });
            ind = ind + 1;
        }
        return gooseFxPools;
    }
    catch (_a) {
        return {};
    }
}
exports.loadGooseFx = loadGooseFx;
