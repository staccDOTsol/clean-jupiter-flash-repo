"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symmetryRoute = void 0;
const web3_js_1 = require("@solana/web3.js");
function symmetryRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let routeData = liquidityData.symmetryData.symmetry.getRouteData(new web3_js_1.PublicKey(fromCoin.mintAddress), new web3_js_1.PublicKey(toCoin.mintAddress), fromCoinAmount);
    let received = routeData.toAmount;
    let totalFees = (settings.owner.fee + settings.host.fee) / 100;
    let fees = {};
    fees[toCoin.symbol] = received * totalFees / 100;
    let amountWithFees = received * (1 - totalFees / 100);
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: received,
        amountWithFees: amountWithFees,
        minimumReceived: amountWithFees * (1 - settings.slippage / 100),
        provider: "symmetry",
        fees: fees,
        priceImpact: 0,
        routeData: {
            symmetryInfo: routeData,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.symmetryRoute = symmetryRoute;
