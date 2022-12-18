"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sarosRoute = void 0;
function sarosRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let sarosInfo = liquidityData.sarosData[option.swapAccount];
    let beforeX = sarosInfo.aTokenAmount;
    let beforeY = sarosInfo.bTokenAmount;
    let fromToken = sarosInfo.tokenA;
    let toToken = sarosInfo.tokenB;
    if (fromCoin.mintAddress != sarosInfo.mintA.toBase58()) {
        [beforeX, beforeY] = [beforeY, beforeX];
        [fromToken, toToken] = [toToken, fromToken];
    }
    let num = sarosInfo.tradeFeeNumerator.toNumber();
    let den = sarosInfo.tradeFeeDenominator.toNumber();
    let afterX = beforeX + fromCoinAmount * (den - num) / den * 10 ** fromCoin.decimals;
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
        provider: "saros",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            sarosPool: Object.assign(Object.assign({}, sarosInfo), { fromToken: fromToken, toToken: toToken }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.sarosRoute = sarosRoute;
