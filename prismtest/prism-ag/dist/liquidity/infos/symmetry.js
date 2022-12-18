"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSymmetry = exports._loadSymmetry = void 0;
function _loadSymmetry(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let tokenSwap = liquidity[0].tokenSwap;
        let pubkeys = tokenSwap.getAccountsForUpdate();
        let accounts = [];
        for (let i = 0; i < pubkeys.length; i++) {
            accounts.push({ account: pubkeys[i], provider: "symmetry" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadSymmetry = _loadSymmetry;
function loadSymmetry(liquidity, accountInfos) {
    try {
        if (!liquidity || liquidity.length == 0 || !accountInfos)
            return {};
        let tokenSwap = liquidity[0].tokenSwap;
        tokenSwap.update(accountInfos.map(x => x.account));
        return { "symmetry": tokenSwap };
    }
    catch (_a) {
        return {};
    }
}
exports.loadSymmetry = loadSymmetry;
