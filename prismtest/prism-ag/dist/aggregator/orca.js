"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orcaRoute = void 0;
const spl_token_swap_1 = require("@solana/spl-token-swap");
const scurve_1 = require("./scurve");
function orcaRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let orcaInfo = liquidityData.orcaData[option.pool.poolParams.address];
    let pool = orcaInfo.pool;
    let num = pool.poolParams.feeStructure.traderFee.numerator.toNumber();
    let den = pool.poolParams.feeStructure.traderFee.denominator.toNumber();
    let beforeX = orcaInfo.aTokenAmount;
    let beforeY = orcaInfo.bTokenAmount;
    let fromToken = orcaInfo.tokenA;
    let toToken = orcaInfo.tokenB;
    if (fromCoin.mintAddress != orcaInfo.tokenA.mint.toBase58()) {
        [beforeX, beforeY] = [beforeY, beforeX];
        [fromToken, toToken] = [toToken, fromToken];
    }
    let SMALL_AMOUNT = 10000;
    let fromAmount = fromCoinAmount * (den - num) / den * 10 ** fromCoin.decimals;
    let received, amountWithFees, priceImpact, fees = {};
    if (pool.poolParams.curveType != 0) {
        const quote = (0, scurve_1.computeOutputAmount)(new spl_token_swap_1.Numberu64(fromAmount), new spl_token_swap_1.Numberu64(beforeX), new spl_token_swap_1.Numberu64(beforeY), new spl_token_swap_1.Numberu64(pool.poolParams.amp));
        const smallQuote = (0, scurve_1.computeOutputAmount)(new spl_token_swap_1.Numberu64(SMALL_AMOUNT), new spl_token_swap_1.Numberu64(beforeX), new spl_token_swap_1.Numberu64(beforeY), new spl_token_swap_1.Numberu64(pool.poolParams.amp));
        let outAmount = quote.toNumber() / 10 ** toCoin.decimals;
        received = outAmount;
        let totalFees = (settings.owner.fee + settings.host.fee) / 100;
        fees[toCoin.symbol] = outAmount * totalFees / 100;
        amountWithFees = outAmount * (1 - totalFees / 100);
        const smallOutAmount = smallQuote.toNumber();
        const smallRate = smallOutAmount / SMALL_AMOUNT;
        let priceImpactPct = (smallRate - outAmount / fromCoinAmount) / smallRate;
        priceImpact = priceImpactPct < 0 ? 0 : priceImpactPct;
    }
    else {
        let afterX = beforeX + fromCoinAmount * 0.997 * 10 ** fromCoin.decimals;
        let afterY = beforeX * beforeY / afterX;
        received = (beforeY - afterY) / 10 ** toCoin.decimals;
        let bestPrice = beforeY / beforeX;
        let execPrice = (beforeY - afterY) / (afterX - beforeX);
        priceImpact = 100 * (Math.max(execPrice, bestPrice) - Math.min(execPrice, bestPrice)) / bestPrice;
        let totalFees = (settings.owner.fee + settings.host.fee) / 100;
        fees[toCoin.symbol] = received * totalFees / 100;
        amountWithFees = received * (1 - totalFees / 100);
    }
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: received,
        amountWithFees: amountWithFees,
        minimumReceived: amountWithFees * (1 - settings.slippage / 100),
        provider: "orca",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            orcaPool: Object.assign(Object.assign({}, orcaInfo.pool), { fromToken: fromToken, toToken: toToken }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.orcaRoute = orcaRoute;
