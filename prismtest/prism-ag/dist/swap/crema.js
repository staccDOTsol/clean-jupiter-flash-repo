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
exports.cremaSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const bn_js_1 = __importDefault(require("bn.js"));
function cremaSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, cremaInfo } = route.routeData;
        let [swapSource, swapDestination] = [cremaInfo.tokenSwapInfo.swapTokenA, cremaInfo.tokenSwapInfo.swapTokenB];
        if (cremaInfo.tokenSwapInfo.tokenAMint.toBase58() != fromCoin.mintAddress)
            [swapSource, swapDestination] = [swapDestination, swapSource];
        return program.instruction.cremaSwap(new bn_js_1.default(route.amountIn * 10 ** fromCoin.decimals), new bn_js_1.default(route.minimumReceived * 10 ** toCoin.decimals), useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                cremaTokenSwap: cremaInfo.programId,
                tokenSwapKey: cremaInfo.tokenSwapKey,
                cremaAuthority: cremaInfo.authority,
                authority: user,
                fromTokenAccount: fromTokenAccount,
                toTokenAccount: toTokenAccount,
                swapSource: swapSource,
                swapDestination: swapDestination,
                ticksKey: cremaInfo.tokenSwapInfo.ticksKey,
                tokenProgram: new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                host: fees.host,
            },
        });
    });
}
exports.cremaSwap = cremaSwap;
