"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balansolRoute = void 0;
const web3_js_1 = require("@solana/web3.js");
const jsbi_1 = __importDefault(require("jsbi"));
const helper_1 = require("../liquidity/providers/Balansol/helper");
function balansolRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let balansolInfo = liquidityData.balansolData[option.poolAddress];
    let quote = (0, helper_1.getQuote)(new web3_js_1.PublicKey(fromCoin.mintAddress), new web3_js_1.PublicKey(toCoin.mintAddress), fromCoinAmount * 10 ** fromCoin.decimals, balansolInfo);
    let outAmount = jsbi_1.default.toNumber(quote.outAmount);
    let feeAmount = jsbi_1.default.toNumber(quote.feeAmount);
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: outAmount / 10 ** toCoin.decimals,
        amountWithFees: outAmount / 10 ** toCoin.decimals,
        minimumReceived: outAmount / 10 ** toCoin.decimals * (1 - settings.slippage / 100),
        provider: "balansol",
        fees: feeAmount / 10 ** toCoin.decimals,
        priceImpact: quote.priceImpactPct,
        routeData: {
            balansolInfo: balansolInfo,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.balansolRoute = balansolRoute;
