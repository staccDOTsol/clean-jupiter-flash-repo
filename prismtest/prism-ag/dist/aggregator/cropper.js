"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cropperRoute = void 0;
function cropperRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let cropperInfo = liquidityData.cropperData[option.swapAccount];
    let beforeX = cropperInfo.aTokenAmount;
    let beforeY = cropperInfo.bTokenAmount;
    let fromToken = cropperInfo.tokenA;
    let toToken = cropperInfo.tokenB;
    let mint = cropperInfo.mintA;
    if (fromCoin.mintAddress != cropperInfo.mintA.toBase58()) {
        [beforeX, beforeY] = [beforeY, beforeX];
        [fromToken, toToken] = [toToken, fromToken];
        mint = cropperInfo.mintB;
    }
    let afterX = beforeX + fromCoinAmount * 0.999 * 10 ** fromCoin.decimals;
    let afterY = beforeX * beforeY / afterX;
    let received = (beforeY - afterY) / 10 ** toCoin.decimals * 0.998;
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
        provider: "cropper",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            cropperPool: Object.assign(Object.assign({}, cropperInfo), { fromToken: fromToken, toToken: toToken, mint: mint }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.cropperRoute = cropperRoute;
