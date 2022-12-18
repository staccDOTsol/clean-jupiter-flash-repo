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
exports.senchaSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const bn_js_1 = __importDefault(require("bn.js"));
function senchaSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, senchaPool } = route.routeData;
        let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
        let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
        return program.instruction.senchaSwap(amountIn, amountOut, useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                tokenProgram: new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                senchaProgram: new web3_js_1.PublicKey(types_1.SENCHA_PROGRAM_ID),
                swap: senchaPool.swapInfo,
                userAuthority: user,
                userTokenAccountA: fromTokenAccount,
                reserveTokenAccountA: senchaPool.fromToken,
                feesAccountA: senchaPool.feeA,
                userTokenAccountB: toTokenAccount,
                reserveTokenAccountB: senchaPool.toToken,
                feesAccountB: senchaPool.feeB,
                systemProgram: web3_js_1.SystemProgram.programId,
                host: fees.host,
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
            },
        });
    });
}
exports.senchaSwap = senchaSwap;
