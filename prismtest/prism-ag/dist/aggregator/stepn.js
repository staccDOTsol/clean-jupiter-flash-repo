"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepnRoute = void 0;
function stepnRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let stepnInfo = liquidityData.stepnData[option.swapAccount];
    let beforeX = stepnInfo.aTokenAmount;
    let beforeY = stepnInfo.bTokenAmount;
    let fromToken = stepnInfo.tokenA;
    let toToken = stepnInfo.tokenB;
    if (fromCoin.mintAddress != stepnInfo.mintA.toBase58()) {
        [beforeX, beforeY] = [beforeY, beforeX];
        [fromToken, toToken] = [toToken, fromToken];
    }
    let afterX = beforeX + fromCoinAmount * 0.99 * 10 ** fromCoin.decimals;
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
        provider: "stepn",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            stepnPool: Object.assign(Object.assign({}, stepnInfo), { fromToken: fromToken, toToken: toToken }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.stepnRoute = stepnRoute;
