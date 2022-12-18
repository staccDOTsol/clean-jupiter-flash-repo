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
exports.stepnSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const types_1 = require("../types/types");
function stepnSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, stepnPool } = route.routeData;
        let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
        let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
        return program.instruction.stepnSwap(amountIn, amountOut, useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                stepnProgram: new web3_js_1.PublicKey(types_1.STEPN_PROGRAM_ID),
                swapInfo: new web3_js_1.PublicKey(stepnPool.swapAccount),
                swapAuthority: stepnPool.authority,
                userTransferAuthority: user,
                source: fromTokenAccount,
                swapSource: stepnPool.fromToken,
                swapDestination: stepnPool.toToken,
                destination: toTokenAccount,
                poolMint: stepnPool.poolTokenMint,
                poolFee: stepnPool.feeAccount,
                tokenProgram: new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID),
                systemProgram: web3_js_1.SystemProgram.programId,
                host: fees.host,
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
            },
        });
    });
}
exports.stepnSwap = stepnSwap;
