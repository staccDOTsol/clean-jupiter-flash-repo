"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPenguinPools = exports.getPenguinCacheData = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("./common");
const types_1 = require("../../types/types");
const spl_token_swap_1 = require("@solana/spl-token-swap");
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
function getPenguinCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let programAccounts = yield (0, common_1.getFilteredProgramAccounts)(connection, new web3_js_1.PublicKey(types_1.PENGUIN_PROGRAM_ID), [{ dataSize: 324 }]);
            return {
                programAccounts: programAccounts,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getPenguinCacheData = getPenguinCacheData;
function getPenguinPools(data) {
    try {
        let programAccounts = data.programAccounts;
        let pools = {};
        for (let i = 0; i < programAccounts.length; i++) {
            let decoded = spl_token_swap_1.TokenSwapLayout.decode(Buffer.from(programAccounts[i].accountInfo.data));
            let authority = (0, pubkey_1.findProgramAddressSync)([programAccounts[i].publicKey.toBuffer()], new web3_js_1.PublicKey(types_1.PENGUIN_PROGRAM_ID))[0];
            let pool = Object.assign(Object.assign({}, decoded), { authority: authority, swapAccount: programAccounts[i].publicKey.toBase58(), provider: "penguin" });
            let coinMint = new web3_js_1.PublicKey(pool.mintA).toBase58();
            let pcMint = new web3_js_1.PublicKey(pool.mintB).toBase58();
            //console.log(pool.quoteTokenVault.toBase58())
            //console.log(pool.baseTokenVault.toBase58())
            //console.log(coinMint)
            //console.log(pcMint)
            if (pool.curveType != 0) {
                continue;
            }
            (pools[coinMint] || (pools[coinMint] = [])).push(Object.assign(Object.assign({}, pool), { other: pcMint }));
            (pools[pcMint] || (pools[pcMint] = [])).push(Object.assign(Object.assign({}, pool), { other: coinMint }));
        }
        return pools;
    }
    catch (_a) {
        return {};
    }
}
exports.getPenguinPools = getPenguinPools;
