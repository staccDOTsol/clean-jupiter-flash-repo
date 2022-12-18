"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLifinity = exports._loadLifinity = void 0;
const sdk_1 = require("@lifinity/sdk");
const web3_js_1 = require("@solana/web3.js");
function _loadLifinity(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let publicKeys = [];
        let allPublicKeys = [];
        for (let i = 0; i < liquidity.length; i++) {
            publicKeys.push([]);
            publicKeys[i].push({ account: new web3_js_1.PublicKey(liquidity[i].amm), provider: "lifinity" });
            publicKeys[i].push({ account: new web3_js_1.PublicKey(liquidity[i].poolCoinTokenAccount), provider: "lifinity" });
            publicKeys[i].push({ account: new web3_js_1.PublicKey(liquidity[i].poolPcTokenAccount), provider: "lifinity" });
            publicKeys[i].push({ account: new web3_js_1.PublicKey(liquidity[i].configAccount), provider: "lifinity" });
            publicKeys[i].push({ account: new web3_js_1.PublicKey(liquidity[i].pythAccount), provider: "lifinity" });
            if (liquidity[i].pythAccount !== liquidity[i].pythPcAccount)
                publicKeys[i].push({ account: new web3_js_1.PublicKey(liquidity[i].pythPcAccount), provider: "lifinity" });
            allPublicKeys.push(...publicKeys[i]);
        }
        return allPublicKeys;
    }
    catch (_a) {
        return [];
    }
}
exports._loadLifinity = _loadLifinity;
function loadLifinity(liquidity, multipleInfo, slot) {
    try {
        if (!liquidity || liquidity.length == 0 || !multipleInfo)
            return {};
        let publicKeys = [];
        for (let i = 0; i < liquidity.length; i++) {
            publicKeys.push([]);
            publicKeys[i].push(new web3_js_1.PublicKey(liquidity[i].amm));
            publicKeys[i].push(new web3_js_1.PublicKey(liquidity[i].poolCoinTokenAccount));
            publicKeys[i].push(new web3_js_1.PublicKey(liquidity[i].poolPcTokenAccount));
            publicKeys[i].push(new web3_js_1.PublicKey(liquidity[i].configAccount));
            publicKeys[i].push(new web3_js_1.PublicKey(liquidity[i].pythAccount));
            if (liquidity[i].pythAccount !== liquidity[i].pythPcAccount)
                publicKeys[i].push(new web3_js_1.PublicKey(liquidity[i].pythPcAccount));
        }
        let lifinitySwaps = {};
        let accountsParsed = 0;
        for (let i = 0; i < liquidity.length; i++) {
            let parsedData = (0, sdk_1.getParsedData)(multipleInfo.slice(accountsParsed, accountsParsed + publicKeys[i].length), liquidity[i]);
            accountsParsed += publicKeys[i].length;
            lifinitySwaps[liquidity[i].amm] = Object.assign(Object.assign({}, liquidity[i]), { parsedData: parsedData, slot: slot });
        }
        return lifinitySwaps;
    }
    catch (_a) {
        return {};
    }
}
exports.loadLifinity = loadLifinity;
