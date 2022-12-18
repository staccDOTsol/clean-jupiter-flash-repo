"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cremaRoute = void 0;
const decimal_js_1 = require("decimal.js");
function cremaRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let cremaInfo = liquidityData.cremaData[option.tokenSwapKey.toBase58()];
    let amountIn = new decimal_js_1.Decimal(fromCoinAmount * 10 ** fromCoin.decimals);
    let result = (cremaInfo.tokenSwapInfo.tokenAMint.toBase58() == fromCoin.mintAddress) ?
        cremaInfo.preSwapA(amountIn) : cremaInfo.preSwapB(amountIn);
    let amountOut = result.amountOut.toNumber() / 10 ** toCoin.decimals;
    let resultSmall = (cremaInfo.tokenSwapInfo.tokenAMint.toBase58() == fromCoin.mintAddress) ?
        cremaInfo.preSwapA(new decimal_js_1.Decimal(0.1)) : cremaInfo.preSwapB(new decimal_js_1.Decimal(0.1));
    let smallRate = resultSmall.amountOut.toNumber() / (10 ** toCoin.decimals) / 0.1;
    let priceImpactPct = (smallRate - amountOut / fromCoinAmount) / smallRate;
    priceImpactPct = priceImpactPct < 0 ? 0 : priceImpactPct;
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
        provider: "crema",
        fees: fees,
        priceImpact: priceImpactPct,
        routeData: {
            cremaInfo: cremaInfo,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.cremaRoute = cremaRoute;
