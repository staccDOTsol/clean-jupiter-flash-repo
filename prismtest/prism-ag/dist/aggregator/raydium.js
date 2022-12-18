"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raydiumRoute = exports.getSwapOutAmount = void 0;
const safeMath_1 = require("../utils/safeMath");
function getSwapOutAmount(poolInfo, fromCoinMint, toCoinMint, amount, slippage) {
    const { coin, pc, fees } = poolInfo;
    const { swapFeeNumerator, swapFeeDenominator } = fees;
    if (fromCoinMint === coin.mintAddress && toCoinMint === pc.mintAddress) {
        // coin2pc
        const fromAmount = new safeMath_1.TokenAmount(amount, coin.decimals, false);
        const fromAmountWithFee = fromAmount.wei
            .multipliedBy(swapFeeDenominator - swapFeeNumerator)
            .dividedBy(swapFeeDenominator);
        const denominator = coin.balance.wei.plus(fromAmountWithFee);
        const amountOut = pc.balance.wei.multipliedBy(fromAmountWithFee).dividedBy(denominator);
        const amountOutWithSlippage = amountOut.dividedBy(1 + slippage / 100);
        const outBalance = pc.balance.wei.minus(amountOut);
        const beforePrice = new safeMath_1.TokenAmount(parseFloat(new safeMath_1.TokenAmount(pc.balance.wei, pc.decimals).fixed()) /
            parseFloat(new safeMath_1.TokenAmount(coin.balance.wei, coin.decimals).fixed()), pc.decimals, false);
        const afterPrice = new safeMath_1.TokenAmount(parseFloat(new safeMath_1.TokenAmount(outBalance, pc.decimals).fixed()) /
            parseFloat(new safeMath_1.TokenAmount(denominator, coin.decimals).fixed()), pc.decimals, false);
        const priceImpact = Math.abs((parseFloat(beforePrice.fixed()) - parseFloat(afterPrice.fixed()))
            / parseFloat(beforePrice.fixed())) * 100;
        return {
            amountIn: fromAmount,
            amountOut: parseFloat((new safeMath_1.TokenAmount(amountOut, pc.decimals)).fixed()),
            amountOutWithSlippage: parseFloat((new safeMath_1.TokenAmount(amountOutWithSlippage, pc.decimals)).fixed()),
            // EDITED
            priceImpact: priceImpact,
            afterPrice: parseFloat(afterPrice.fixed()),
        };
    }
    else {
        // pc2coin
        const fromAmount = new safeMath_1.TokenAmount(amount, pc.decimals, false);
        const fromAmountWithFee = fromAmount.wei
            .multipliedBy(swapFeeDenominator - swapFeeNumerator)
            .dividedBy(swapFeeDenominator);
        const denominator = pc.balance.wei.plus(fromAmountWithFee);
        const amountOut = coin.balance.wei.multipliedBy(fromAmountWithFee).dividedBy(denominator);
        const amountOutWithSlippage = amountOut.dividedBy(1 + slippage / 100);
        const outBalance = coin.balance.wei.minus(amountOut);
        const beforePrice = new safeMath_1.TokenAmount(parseFloat(new safeMath_1.TokenAmount(pc.balance.wei, pc.decimals).fixed()) /
            parseFloat(new safeMath_1.TokenAmount(coin.balance.wei, coin.decimals).fixed()), pc.decimals, false);
        const afterPrice = new safeMath_1.TokenAmount(parseFloat(new safeMath_1.TokenAmount(denominator, pc.decimals).fixed()) /
            parseFloat(new safeMath_1.TokenAmount(outBalance, coin.decimals).fixed()), pc.decimals, false);
        const priceImpact = Math.abs((parseFloat(afterPrice.fixed()) - parseFloat(beforePrice.fixed()))
            / parseFloat(beforePrice.fixed())) * 100;
        return {
            amountIn: fromAmount,
            amountOut: parseFloat((new safeMath_1.TokenAmount(amountOut, coin.decimals)).fixed()),
            amountOutWithSlippage: parseFloat((new safeMath_1.TokenAmount(amountOutWithSlippage, coin.decimals)).fixed()),
            // EDITED
            priceImpact: priceImpact,
            afterPrice: parseFloat(afterPrice.fixed()),
        };
    }
}
exports.getSwapOutAmount = getSwapOutAmount;
function raydiumRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, liquidityProviders, settings) {
    let poolInfo = liquidityData.raydiumData[option.ammId.toBase58()];
    poolInfo = Object.assign(Object.assign({}, poolInfo), { serumData: liquidityProviders.all[poolInfo.serumMarket] });
    if (!poolInfo.serumData)
        return { amountOut: 0 };
    let { amountOut, amountOutWithSlippage, priceImpact } = getSwapOutAmount(poolInfo, fromCoin.mintAddress, toCoin.mintAddress, fromCoinAmount, settings.slippage);
    let totalFees = (settings.owner.fee + settings.host.fee) / 100;
    let fees = {};
    //@ts-ignore
    fees[toCoin.symbol] = amountOut * totalFees / 100;
    //@ts-ignore
    let amountWithFees = amountOut * (1 - totalFees / 100);
    amountOutWithSlippage = amountOutWithSlippage * (1 - totalFees / 100);
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: amountOut,
        amountWithFees: amountWithFees,
        minimumReceived: amountOutWithSlippage,
        provider: "raydium",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            poolInfo: poolInfo,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.raydiumRoute = raydiumRoute;
