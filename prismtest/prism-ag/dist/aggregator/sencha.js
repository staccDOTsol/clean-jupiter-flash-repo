"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.senchaRoute = void 0;
function senchaRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let senchaInfo = liquidityData.senchaData[option.swapInfo];
    let beforeX = senchaInfo.aTokenAmount;
    let beforeY = senchaInfo.bTokenAmount;
    let fromToken = senchaInfo.tokenA;
    let toToken = senchaInfo.tokenB;
    let feeA = senchaInfo.adminFeesA, feeB = senchaInfo.adminFeesB;
    if (fromCoin.mintAddress != senchaInfo.mintA.toBase58()) {
        [beforeX, beforeY] = [beforeY, beforeX];
        [fromToken, toToken] = [toToken, fromToken];
        [feeA, feeB] = [feeB, feeA];
    }
    let afterX = beforeX + fromCoinAmount * (1 - senchaInfo.tradeFeeKbps / 10000000) * 10 ** fromCoin.decimals;
    let afterY = beforeX * beforeY / afterX;
    let received = (beforeY - afterY) / 10 ** toCoin.decimals;
    let bestPrice = beforeY / beforeX;
    let execPrice = (beforeY - afterY) / (afterX - beforeX);
    let priceImpact = 100 * (Math.max(execPrice, bestPrice) - Math.min(execPrice, bestPrice)) / bestPrice;
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
        provider: "sencha",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            senchaPool: Object.assign(Object.assign({}, senchaInfo), { fromToken: fromToken, toToken: toToken, feeA: feeA, feeB: feeB }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.senchaRoute = senchaRoute;
