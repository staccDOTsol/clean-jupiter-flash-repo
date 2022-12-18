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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balansolSwap = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const bn_js_1 = __importDefault(require("bn.js"));
const token_1 = require("@project-serum/anchor/dist/cjs/utils/token");
function balansolSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, balansolInfo } = route.routeData;
        let poolAddress = balansolInfo.poolAddress;
        const bidMintIdx = balansolInfo.mints.findIndex((mint) => mint.equals(new web3_js_1.PublicKey(fromCoin.mintAddress)));
        const askMintIdx = balansolInfo.mints.findIndex((mint) => mint.equals(new web3_js_1.PublicKey(toCoin.mintAddress)));
        return program.instruction.balansolSwap(new bn_js_1.default(route.amountIn * 10 ** fromCoin.decimals), new bn_js_1.default(route.minimumReceived * 10 ** toCoin.decimals), useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                balansolProgram: new web3_js_1.PublicKey("D3BBjqUdCYuP18fNvvMbPAZ8DpcRi4io2EsYHQawJDag"),
                userAuthority: user,
                pool: new web3_js_1.PublicKey(poolAddress),
                taxman: balansolInfo.taxMan,
                dstTokenAccountTaxman: balansolInfo.taxmanTokenAccounts[askMintIdx],
                bidMint: new web3_js_1.PublicKey(fromCoin.mintAddress),
                treasurer: balansolInfo.treasurer,
                srcTreasury: balansolInfo.treasuries[bidMintIdx],
                srcAssociatedTokenAccount: fromTokenAccount,
                askMint: new web3_js_1.PublicKey(toCoin.mintAddress),
                dstTreasuty: balansolInfo.treasuries[askMintIdx],
                dstAssociatedTokenAccount: toTokenAccount,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor_1.web3.SystemProgram.programId,
                associatedTokenProgram: token_1.ASSOCIATED_PROGRAM_ID,
                tokenProgram: types_1.TOKEN_PROGRAM_ID,
                host: fees.host,
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
            },
        });
    });
}
exports.balansolSwap = balansolSwap;
