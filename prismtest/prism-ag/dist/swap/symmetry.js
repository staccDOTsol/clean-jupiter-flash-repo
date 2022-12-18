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
exports.symmetrySwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const spl_token_1 = require("@solana/spl-token");
const bn_js_1 = __importDefault(require("bn.js"));
function symmetrySwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin } = route.routeData;
        let symmetryInfo = route.routeData.symmetryInfo;
        let swapAccounts = symmetryInfo.swapAccounts;
        let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
        let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
        return program.instruction.symmetrySwap(new bn_js_1.default(symmetryInfo.fromTokenId), new bn_js_1.default(symmetryInfo.toTokenId), amountIn, amountOut, useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                symmetryProgram: swapAccounts.program,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: new web3_js_1.PublicKey(spl_token_1.TOKEN_PROGRAM_ID),
                buyer: user,
                fundState: swapAccounts.fundState,
                pdaAccount: swapAccounts.authority,
                pdaFromTokenAccount: swapAccounts.source,
                buyerFromTokenAccount: fromTokenAccount,
                pdaToTokenAccount: swapAccounts.destination,
                buyerToTokenAccount: toTokenAccount,
                swapFeeAccount: yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, swapAccounts.fees.smfWallet),
                hostFeeAccount: yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, swapAccounts.fees.hostWallet),
                managerFeeAccount: yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, swapAccounts.fees.managerWallet),
                tokenInfo: swapAccounts.tokenInfo,
                prismData: swapAccounts.curveData,
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                host: fees.host,
            },
            remainingAccounts: swapAccounts.remainingAccounts,
        });
    });
}
exports.symmetrySwap = symmetrySwap;
