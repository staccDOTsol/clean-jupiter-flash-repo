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
exports.marinadeSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const types_1 = require("../types/types");
const marinade_1 = require("../liquidity/infos/marinade");
const spl_token_1 = require("@solana/spl-token");
const token_instructions_1 = require("@project-serum/serum/lib/token-instructions");
function marinadeSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, preTransaction, postTransaction, mainSigners, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin } = route.routeData;
        if (fromCoin.symbol == 'SOL') {
            let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
            let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
            let transferFrom = new web3_js_1.Account();
            const ata = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID), new web3_js_1.PublicKey(marinade_1.SOL_MINT), transferFrom.publicKey, true);
            preTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID), new web3_js_1.PublicKey(marinade_1.SOL_MINT), ata, transferFrom.publicKey, user));
            postTransaction.add((0, token_instructions_1.closeAccount)({
                source: ata,
                destination: user,
                owner: transferFrom.publicKey
            }));
            mainSigners.push(transferFrom);
            return program.instruction.marinadeStake(amountIn, amountOut, useT ? true : false, new bn_js_1.default(hostFees), {
                accounts: {
                    userAuthority: user,
                    marinadeProgram: types_1.MARINADE_PROGRAM_ID,
                    state: types_1.MARINADE_STATE,
                    msolMint: types_1.MSOL_MINT,
                    liqPoolSolLegPda: types_1.LIQ_POOL_SOL_LEG_PDA,
                    liqPoolMsolLeg: types_1.LIQ_POOL_MSOL_LEG,
                    liqPoolMsolLegAuthority: types_1.LIQ_POOL_MSOL_LEG_AUTHORITY,
                    reservePda: types_1.RESERVE_PDA,
                    userWsolAccount: fromTokenAccount,
                    transferFrom: transferFrom.publicKey,
                    transferFromWsolAccount: ata,
                    mintTo: toTokenAccount,
                    msolMintAuthority: types_1.MSOL_MINT_AUTHORITY,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    tokenProgram: new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID),
                    host: fees.host,
                    feeSweeper: fees.owner,
                    transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                },
            });
        }
        else {
            let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
            let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
            let solReceiver = new web3_js_1.Account();
            mainSigners.push(solReceiver);
            postTransaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: solReceiver.publicKey,
                toPubkey: user,
                lamports: 0,
            }));
            return program.instruction.marinadeUnstake(amountIn, amountOut, useT ? true : false, new bn_js_1.default(hostFees), {
                accounts: {
                    userAuthority: user,
                    marinadeProgram: types_1.MARINADE_PROGRAM_ID,
                    state: types_1.MARINADE_STATE,
                    msolMint: types_1.MSOL_MINT,
                    liqPoolSolLegPda: types_1.LIQ_POOL_SOL_LEG_PDA,
                    liqPoolMsolLeg: types_1.LIQ_POOL_MSOL_LEG,
                    treasuryMsolAccount: new web3_js_1.PublicKey('Bcr3rbZq1g7FsPz8tawDzT6fCzN1pvADthcv3CtTpd3b'),
                    userMsolAccount: fromTokenAccount,
                    solReceiver: solReceiver.publicKey,
                    userWsolAccount: toTokenAccount,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    tokenProgram: new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID),
                    host: fees.host,
                    feeSweeper: fees.owner,
                    transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                },
            });
        }
    });
}
exports.marinadeSwap = marinadeSwap;
