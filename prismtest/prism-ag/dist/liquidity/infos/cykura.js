"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCykura = exports._loadCykura = void 0;
const sdk_1 = require("@orca-so/sdk");
function _loadCykura(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            accounts.push({ account: pool.vault0, provider: "cykura" });
            accounts.push({ account: pool.vault1, provider: "cykura" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadCykura = _loadCykura;
function loadCykura(liquidity, connection, result) {
    var _a, _b;
    try {
        if (!liquidity || liquidity.length == 0 || !result)
            return {};
        // let waitLoad: any[] = [];
        // for (let i = 0; i < liquidity.length; i++) {
        //     waitLoad.push(liquidity[i].tickProvider.eagerLoadCache(liquidity[i].tick, TICK_SPACINGS[liquidity[i].fee as FeeAmount]))
        // }
        // await Promise.all(waitLoad);
        let pools = {};
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            console.log(pool)
            //console.log(pool.quoteTokenVault.toBase58())
            //console.log(pool.baseTokenVault.toBase58())
            let coinMint = pool.mintA.toBase58();
            let pcMint = pool.mintB.toBase58();
            (pools[coinMint] || (pools[coinMint] = [])).push(Object.assign(Object.assign({}, pool), { other: pcMint }));
            (pools[pcMint] || (pools[pcMint] = [])).push(Object.assign(Object.assign({}, pool), { other: coinMint }));
        }
        let cykuraPools = {};
        for (let i = 0; i < liquidity.length; i++) {
            let pool = liquidity[i];
            if (result[2 * i].account == null || result[2 * i + 1].account == null)
                continue;
            cykuraPools[pool.poolAccount] = Object.assign(Object.assign({}, pool), { tokenAmount0: (_a = (0, sdk_1.deserializeAccount)(result[2 * i].account.data)) === null || _a === void 0 ? void 0 : _a.amount, tokenAmount1: (_b = (0, sdk_1.deserializeAccount)(result[2 * i + 1].account.data)) === null || _b === void 0 ? void 0 : _b.amount, cyclosCore: pool.cyclosCore });
        }
        return cykuraPools;
    }
    catch (_c) {
        return {};
    }
}
exports.loadCykura = loadCykura;
