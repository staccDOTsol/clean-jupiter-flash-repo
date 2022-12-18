"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lifinityRoute = void 0;
const sdk_1 = require("@lifinity/sdk");
const decimal_js_1 = __importDefault(require("decimal.js"));
function lifinityRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let lifinityInfo = liquidityData.lifinityData[option.amm];
    let parsedData = lifinityInfo.parsedData;
    let tradeDirection = (lifinityInfo.poolCoinMint == fromCoin.mintAddress) ?
        sdk_1.TradeDirection.AtoB : sdk_1.TradeDirection.BtoA;
    const { amountSwapped, priceImpact, fee, feePercent } = (0, sdk_1.getCurveAmount)(new decimal_js_1.default(fromCoinAmount * 10 ** fromCoin.decimals), lifinityInfo.slot, parsedData.amm, parsedData.fees, parsedData.coinBalance, parsedData.pcBalance, parsedData.config, parsedData.pyth, parsedData.pythPc, tradeDirection);
    let amountOut = amountSwapped.toNumber() / 10 ** toCoin.decimals;
    let totalFees = (settings.owner.fee + settings.host.fee) / 100;
    let fees = {};
    fees[toCoin.symbol] = amountOut * totalFees / 100;
    let amountWithFees = amountOut * (1 - totalFees / 100);
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: amountOut,
        amountWithFees: amountWithFees,
        minimumReceived: amountWithFees * (1 - settings.slippage / 100),
        provider: "lifinity",
        fees: fees,
        priceImpact: priceImpact.toNumber() * 100,
        routeData: {
            lifinityInfo: lifinityInfo,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.lifinityRoute = lifinityRoute;
