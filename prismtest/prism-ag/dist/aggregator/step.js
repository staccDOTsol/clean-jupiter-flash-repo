"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepRoute = void 0;
function stepRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let stepInfo = liquidityData.stepData[option.swapAccount];
    let beforeX = stepInfo.aTokenAmount;
    let beforeY = stepInfo.bTokenAmount;
    let fromToken = stepInfo.tokenA;
    let toToken = stepInfo.tokenB;
    if (fromCoin.mintAddress != stepInfo.mintA.toBase58()) {
        [beforeX, beforeY] = [beforeY, beforeX];
        [fromToken, toToken] = [toToken, fromToken];
    }
    let num = stepInfo.tradeFeeNumerator.toNumber();
    let den = stepInfo.tradeFeeDenominator.toNumber();
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
        provider: "step",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            stepPool: Object.assign(Object.assign({}, stepInfo), { fromToken: fromToken, toToken: toToken }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.stepRoute = stepRoute;
