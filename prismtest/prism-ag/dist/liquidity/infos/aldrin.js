"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAldrin = exports._loadAldrin = void 0;
const sdk_1 = require("@orca-so/sdk");
function _loadAldrin(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let accounts = [];
        for (let i = 0; i < liquidity.length; i++) {
            accounts.push({ account: liquidity[i].baseTokenVault, provider: "aldrin" });
            accounts.push({ account: liquidity[i].quoteTokenVault, provider: "aldrin" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadAldrin = _loadAldrin;
function loadAldrin(liquidity, infos) {
    try {
        if (!liquidity || liquidity.length == 0 || !infos)
            return {};
        let results = [];
        for (let i = 0; i < 2 * liquidity.length; i++) {
            let accountInfo = (0, sdk_1.deserializeAccount)(infos[i].account.data);
            results.push({
                pubkey: accountInfo === null || account === void 0 ? void 0 : infos[i].publicKey.toBase58(),
                mint: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.mint,
                owner: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.owner,
                amount: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.amount,
                delegateOption: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.delegatedAmount,
                delegate: accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.delegate,
            });
        }
        let aldrinPools = {};
        for (let i = 0; i < liquidity.length; i++)
            aldrinPools[liquidity[i].poolPublicKey.toString()] = Object.assign(Object.assign({}, liquidity[i]), { baseVaultInfo: results[i * 2], quoteVaultInfo: results[i * 2 + 1] });
        return aldrinPools;
    }
    catch (_a) {
        return {};
    }
}
exports.loadAldrin = loadAldrin;
