"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercurialRoute = void 0;
const jsbi_1 = __importDefault(require("jsbi"));
const stable = require("./stable");
const DENOMINATOR = 10 ** 10;
function mercurialRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let info = liquidityData.mercurialData[option.swapAccount];
    let beforeX, beforeY;
    let indA = 0, indB = 0;
    for (let i = 0; i < info.tokenAccountsLength; i++) {
        if (info.tokenAmounts[i].toString() == '0')
            return { amountOut: 0 };
        if (info.tokenMints[i] == fromCoin.mintAddress) {
            indA = i;
            beforeX = info.tokenAmounts[i];
        }
        if (info.tokenMints[i] == toCoin.mintAddress) {
            indB = i;
            beforeY = info.tokenAmounts[i];
        }
    }
    let fromAmount = fromCoinAmount * 10 ** fromCoin.decimals;
    const SMALL_AMOUNT = 100000;
    let stableCurve = new stable.Stable(jsbi_1.default.BigInt(info.tokenAccountsLength), jsbi_1.default.BigInt(info.amplificationCoefficient), 
    //@ts-ignore
    info.precisionMultipliers.map(precisionMultiplier => jsbi_1.default.BigInt(precisionMultiplier)));
    let quote = jsbi_1.default.toNumber(stableCurve.getOutputAmount(
    //@ts-ignore
    info.tokenAmounts.map(x => jsbi_1.default.BigInt(x)), jsbi_1.default.BigInt(Math.floor(fromAmount)), indA, indB)) * (1 - info.feeNumerator / DENOMINATOR);
    let smallQuote = jsbi_1.default.toNumber(stableCurve.getOutputAmount(
    //@ts-ignore
    info.tokenAmounts.map(x => jsbi_1.default.BigInt(x)), jsbi_1.default.BigInt(SMALL_AMOUNT), indA, indB)) * (1 - info.feeNumerator / DENOMINATOR);
    let outAmount = quote / 10 ** toCoin.decimals;
    let totalFees = (settings.owner.fee + settings.host.fee) / 100;
    let fees = {};
    fees[toCoin.symbol] = outAmount * totalFees / 100;
    let amountWithFees = outAmount * (1 - totalFees / 100);
    const smallOutAmount = smallQuote;
    const smallRate = smallOutAmount / SMALL_AMOUNT;
    let priceImpactPct = (smallRate - outAmount / fromCoinAmount) / smallRate;
    priceImpactPct = priceImpactPct < 0 ? 0 : priceImpactPct;
    const outAmountWithSlippage = amountWithFees * (1 - settings.slippage / 100);
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: outAmount,
        amountWithFees: amountWithFees,
        minimumReceived: outAmountWithSlippage,
        provider: "mercurial",
        fees: fees,
        priceImpact: priceImpactPct,
        routeData: {
            mercurialPool: info,
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.mercurialRoute = mercurialRoute;
