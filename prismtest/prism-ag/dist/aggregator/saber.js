"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saberRoute = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const saberSDK = __importStar(require("@saberhq/stableswap-sdk"));
const token_utils_1 = require("@saberhq/token-utils");
function saberRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let info = liquidityData.saberData[option.addresses.swapAccount];
    let { exchange, exchangeInfo } = info;
    let fromAmount = fromCoinAmount * 10 ** fromCoin.decimals;
    let sourceToken = exchange.tokens.find((token) => token.address === fromCoin.mintAddress);
    if (!sourceToken)
        return { amountOut: 0 };
    const feePct = new decimal_js_1.default(exchangeInfo.fees.trade.asFraction.toFixed(4));
    const SMALL_AMOUNT = 100000;
    const quote = saberSDK.calculateEstimatedSwapOutputAmount(exchangeInfo, new token_utils_1.TokenAmount(sourceToken, Math.floor(fromAmount)));
    const smallQuote = saberSDK.calculateEstimatedSwapOutputAmount(exchangeInfo, new token_utils_1.TokenAmount(sourceToken, SMALL_AMOUNT));
    let outAmount = quote.outputAmount.toU64().toNumber() / 10 ** toCoin.decimals;
    let totalFees = (settings.owner.fee + settings.host.fee) / 100;
    let fees = {};
    fees[toCoin.symbol] = outAmount * totalFees / 100;
    let amountWithFees = outAmount * (1 - totalFees / 100);
    const smallOutAmount = smallQuote.outputAmount.toU64().toNumber();
    const smallRate = smallOutAmount / SMALL_AMOUNT;
    let priceImpactPct = (smallRate - outAmount / fromCoinAmount) / smallRate;
    priceImpactPct = priceImpactPct < 0 ? 0 : priceImpactPct;
    const outAmountWithSlippage = amountWithFees * (1 - settings.slippage / 100);
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: outAmount,
        amountWithFees: amountWithFees,
        minimumReceived: outAmountWithSlippage,
        provider: "saber",
        fees: fees,
        priceImpact: priceImpactPct,
        routeData: {
            saberInfo: info,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.saberRoute = saberRoute;
