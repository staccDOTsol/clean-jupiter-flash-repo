"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serumRoute = exports.getOutAmount = exports.forecastSell = exports.forecastBuy = void 0;
const bn_js_1 = require("bn.js");
function forecastBuy(market, orderBook, pcIn, slippage) {
    let coinOut = 0;
    let bestPrice = null;
    let worstPrice = 0;
    let availablePc = pcIn;
    let min = market.quoteSizeLotsToNumber(new bn_js_1.BN(1));
    let divided = pcIn / min;
    pcIn = Math.floor(divided) * min;
    for (const { key, quantity } of orderBook.items(false)) {
        const price = (market === null || market === void 0 ? void 0 : market.priceLotsToNumber(key.ushrn(64))) || 0;
        const size = (market === null || market === void 0 ? void 0 : market.baseSizeLotsToNumber(quantity)) || 0;
        if (!bestPrice && price !== 0) {
            bestPrice = price;
        }
        const orderPcVaule = price * size;
        worstPrice = price;
        if (orderPcVaule >= availablePc) {
            coinOut += availablePc / price;
            availablePc = 0;
            break;
        }
        else {
            coinOut += size;
            availablePc -= orderPcVaule;
        }
    }
    coinOut = coinOut * 0.9996;
    // @ts-ignore
    const priceImpact = ((worstPrice - bestPrice) / bestPrice) * 100;
    // worstPrice = (worstPrice * (100 + slippage)) / 100
    const amountOutWithSlippage = (coinOut * (100 - slippage)) / 100;
    // const avgPrice = (pcIn - availablePc) / coinOut;
    const maxInAllow = pcIn - availablePc;
    let minout = market.baseSizeLotsToNumber(new bn_js_1.BN(1));
    let divout = coinOut / minout;
    let maxCoinOut = Math.floor(divout) * minout;
    if (maxCoinOut == 0)
        coinOut = 0;
    return {
        side: 'buy',
        maxInAllow,
        maxInAmount: pcIn,
        maxOutAmount: maxCoinOut,
        amountOut: coinOut,
        amountOutWithSlippage,
        worstPrice,
        priceImpact
    };
}
exports.forecastBuy = forecastBuy;
function forecastSell(market, orderBook, coinIn, slippage) {
    let pcOut = 0;
    let bestPrice = null;
    let worstPrice = 0;
    let availableCoin = coinIn;
    let min = market.baseSizeLotsToNumber(new bn_js_1.BN(1));
    let divided = coinIn / min;
    coinIn = Math.floor(divided) * min;
    for (const { key, quantity } of orderBook.items(true)) {
        const price = market.priceLotsToNumber(key.ushrn(64)) || 0;
        const size = (market === null || market === void 0 ? void 0 : market.baseSizeLotsToNumber(quantity)) || 0;
        if (!bestPrice && price !== 0) {
            bestPrice = price;
        }
        worstPrice = price;
        if (availableCoin <= size) {
            pcOut += availableCoin * price;
            availableCoin = 0;
            break;
        }
        else {
            pcOut += price * size;
            availableCoin -= size;
        }
    }
    pcOut = pcOut * 0.9996;
    let minout = market.quoteSizeLotsToNumber(new bn_js_1.BN(1));
    let divout = pcOut / minout;
    let maxPcOut = Math.floor(divout) * minout;
    if (maxPcOut == 0)
        pcOut = 0;
    // @ts-ignore
    const priceImpact = ((bestPrice - worstPrice) / bestPrice) * 100;
    // worstPrice = (worstPrice * (100 - slippage)) / 100
    const amountOutWithSlippage = (pcOut * (100 - slippage)) / 100;
    // const avgPrice = pcOut / (coinIn - availableCoin);
    const maxInAllow = coinIn - availableCoin;
    return {
        side: 'sell',
        maxInAllow,
        maxInAmount: coinIn,
        maxOutAmount: maxPcOut,
        amountOut: pcOut,
        amountOutWithSlippage,
        worstPrice,
        priceImpact
    };
}
exports.forecastSell = forecastSell;
function getOutAmount(market, asks, bids, fromCoinMint, toCoinMint, fromAmount, slippage) {
    let fromMint = fromCoinMint;
    let toMint = toCoinMint;
    if (fromMint === market.quoteMintAddress.toBase58() && toMint === market.baseMintAddress.toBase58()) {
        return forecastBuy(market, asks, fromAmount, slippage);
    }
    else {
        return forecastSell(market, bids, fromAmount, slippage);
    }
}
exports.getOutAmount = getOutAmount;
function serumRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let marketConfig = liquidityData.serumData[option.ownAddress.toBase58()];
    let { amountOut, amountOutWithSlippage, priceImpact, side, maxInAmount, maxOutAmount } = getOutAmount(marketConfig.market, marketConfig.asks, marketConfig.bids, fromCoin.mintAddress, toCoin.mintAddress, fromCoinAmount, settings.slippage);
    let totalFees = (settings.owner.fee + settings.host.fee) / 100;
    let fees = {};
    fees[toCoin.symbol] = amountOut * totalFees / 100;
    let amountWithFees = amountOut * (1 - totalFees / 100);
    amountOutWithSlippage = amountOutWithSlippage * (1 - totalFees / 100);
    if (maxInAmount == 0)
        amountOut = 0;
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        maxInAmount: maxInAmount,
        maxOutAmount: maxOutAmount,
        to: toCoin.symbol,
        amountOut: amountOut,
        amountWithFees: amountWithFees,
        minimumReceived: amountOutWithSlippage,
        provider: "serum",
        fees: fees,
        priceImpact: priceImpact,
        routeData: {
            marketConfig: marketConfig,
            side: side,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.serumRoute = serumRoute;
