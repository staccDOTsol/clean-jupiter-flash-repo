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
exports.getMercurialPools = exports.getMercurialCacheData = void 0;
const web3_js_1 = require("@solana/web3.js");
const common_1 = require("./common");
const types_1 = require("../../types/types");
const sdk_1 = require("@orca-so/sdk");
const getMultInfo_1 = require("../../utils/getMultInfo");
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
function getMercurialCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let programAccounts = yield (0, common_1.getFilteredProgramAccounts)(connection, new web3_js_1.PublicKey(types_1.MERCURIAL_PROGRAM_ID), [{ dataSize: 265 }]);
            let mintPromises = [];
            programAccounts.forEach(account => {
                let decoded = types_1.MERCURIAL_SWAP_LAYOUT.decode(account.accountInfo.data);
                for (let i = 0; i < decoded.tokenAccountsLength; i++)
                    mintPromises.push(decoded.tokenAccounts[i]);
            });
            let mintResponses = yield (0, getMultInfo_1.customGetMultipleAccountInfos)(connection, mintPromises, "Mercurial init providers");
            return {
                programAccounts: programAccounts,
                mintResponses: mintResponses,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getMercurialCacheData = getMercurialCacheData;
function getMercurialPools(data) {
    try {
        let programAccounts = data.programAccounts;
        let mintPromises = [];
        programAccounts.forEach((account) => {
            let decoded = types_1.MERCURIAL_SWAP_LAYOUT.decode(account.accountInfo.data);
            for (let i = 0; i < decoded.tokenAccountsLength; i++)
                mintPromises.push(decoded.tokenAccounts[i]);
        });
        let mintResponses = data.mintResponses;
        let start = 0;
        let pools = {};
        for (let i = 0; i < programAccounts.length; i++) {
            let decoded = types_1.MERCURIAL_SWAP_LAYOUT.decode(programAccounts[i].accountInfo.data);
            let authority = (0, pubkey_1.findProgramAddressSync)([programAccounts[i].publicKey.toBuffer()], new web3_js_1.PublicKey(types_1.MERCURIAL_PROGRAM_ID))[0];
            let pool = Object.assign(Object.assign({}, decoded), { authority: authority, swapAccount: programAccounts[i].publicKey.toBase58(), provider: "mercurial" });
            let tokenAmounts = [];
            //console.log(pool.quoteTokenVault.toBase58())
            //console.log(pool.baseTokenVault.toBase58())
            let tokenMints = [];
            for (let fir = 0; fir < pool.tokenAccountsLength; fir++) {
                let deserialized = (0, sdk_1.deserializeAccount)(mintResponses[start + fir].account.data);
                //@ts-ignore
                tokenAmounts.push(deserialized.amount);
                //@ts-ignore
                tokenMints.push(deserialized.mint.toBase58());
            }
            start += pool.tokenAccountsLength;
            pool = Object.assign(Object.assign({}, pool), { tokenMints: tokenMints, tokenAmounts: tokenAmounts });
            for (let fir = 0; fir < pool.tokenAccountsLength; fir++) {
                for (let sec = 0; sec < pool.tokenAccountsLength; sec++)
                    if (fir != sec) {
                        (pools[tokenMints[fir]] || (pools[tokenMints[fir]] = [])).push(Object.assign(Object.assign({}, pool), { other: tokenMints[sec] }));
                    }
            }
        }
        return pools;
    }
    catch (_a) {
        return {};
    }
}
exports.getMercurialPools = getMercurialPools;
