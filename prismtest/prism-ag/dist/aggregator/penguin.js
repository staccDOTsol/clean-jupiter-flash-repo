"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.penguinRoute = void 0;
const spl_token_swap_1 = require("@solana/spl-token-swap");
const web3_js_1 = require("@solana/web3.js");
function penguinRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let penguinInfo = liquidityData.penguinData[option.swapAccount];
    let beforeX = penguinInfo.aTokenAmount;
    let beforeY = penguinInfo.bTokenAmount;
    let fromToken = penguinInfo.tokenA;
    let toToken = penguinInfo.tokenB;
    if (fromCoin.mintAddress != new web3_js_1.PublicKey(penguinInfo.mintA).toBase58()) {
        [beforeX, beforeY] = [beforeY, beforeX];
        [fromToken, toToken] = [toToken, fromToken];
    }
    let num = spl_token_swap_1.Numberu64.fromBuffer(penguinInfo.tradeFeeNumerator).toNumber();
    let den = spl_token_swap_1.Numberu64.fromBuffer(penguinInfo.tradeFeeDenominator).toNumber();
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
        provider: "penguin",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            penguinPool: Object.assign(Object.assign({}, penguinInfo), { fromToken: fromToken, toToken: toToken }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.penguinRoute = penguinRoute;
