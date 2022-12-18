"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proportional = exports.sharesFromValue = exports.valueFromShares = exports.totalCoolingDown = exports.totalLamportsUnderControl = exports.totalVirtualStakedLamports = exports.calcLamportsFromMsolAmount = exports.calcMsolFromLamports = exports.linearFee = exports.getUnstakeQuote = exports.getDepositQuote = exports.marinadeRoute = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const marinade_1 = require("../liquidity/infos/marinade");
function marinadeRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let marinadeInfo = liquidityData.marinadeData["marinade"];
    let received = 0;
    if (fromCoin.mintAddress == marinade_1.SOL_MINT) {
        if (fromCoinAmount < 0.003)
            return null;
        received = getDepositQuote(marinadeInfo.state, new bn_js_1.default(fromCoinAmount * 10 ** fromCoin.decimals), marinadeInfo.liqPoolMsolLegAmount).toNumber() / 10 ** toCoin.decimals;
    }
    else
        received = getUnstakeQuote(marinadeInfo.state, new bn_js_1.default(fromCoinAmount * 10 ** fromCoin.decimals), new bn_js_1.default(marinadeInfo.liqPoolSolLegPdaAmount)).toNumber() / 10 ** toCoin.decimals;
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
        provider: "marinade",
        fees: fees,
        priceImpact: 0,
        routeData: {
            marinadePool: Object.assign({}, marinadeInfo),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.marinadeRoute = marinadeRoute;
function getDepositQuote(state, amount, liqPoolMsolLegAmount) {
    let userLamports = amount;
    let userMsolBuyOrder = calcMsolFromLamports(state, userLamports);
    let swapMsolMax = bn_js_1.default.min(userMsolBuyOrder, liqPoolMsolLegAmount);
    let outAmount = new bn_js_1.default(0);
    if (swapMsolMax.gt(new bn_js_1.default(0))) {
        let lamportsForTheLiqPool = new bn_js_1.default(0);
        if (userMsolBuyOrder.eq(swapMsolMax)) {
            lamportsForTheLiqPool = userLamports;
        }
        else {
            lamportsForTheLiqPool = calcLamportsFromMsolAmount(state, swapMsolMax);
        }
        outAmount = outAmount.add(swapMsolMax);
        userLamports = userLamports.sub(lamportsForTheLiqPool);
    }
    if (userLamports.gt(new bn_js_1.default(0))) {
        let msolToMint = calcMsolFromLamports(state, userLamports);
        outAmount = outAmount.add(msolToMint);
    }
    return outAmount;
}
exports.getDepositQuote = getDepositQuote;
function getUnstakeQuote(state, amount, liqPoolSolLegPdaAmount) {
    let maxLamports = liqPoolSolLegPdaAmount.sub(state.rentExemptForTokenAcc);
    let userRemoveLamports = calcLamportsFromMsolAmount(state, amount);
    let liquidUnstakeFee = new bn_js_1.default(0);
    if (userRemoveLamports.gt(maxLamports)) {
        liquidUnstakeFee = state.liqPool.lpMaxFee;
    }
    else {
        let afterLamports = maxLamports.sub(userRemoveLamports);
        liquidUnstakeFee = linearFee(state, afterLamports);
    }
    let fee = amount.mul(liquidUnstakeFee).div(new bn_js_1.default(10000));
    return calcLamportsFromMsolAmount(state, amount.sub(fee));
}
exports.getUnstakeQuote = getUnstakeQuote;
function linearFee(state, lamports) {
    if (lamports.gt(state.liqPool.lpLiquidityTarget)) {
        return new bn_js_1.default(state.liqPool.lpMinFee.basisPoints);
    }
    else {
        return state.liqPool.lpMaxFee.basisPoints.sub(proportional(state.liqPool.lpMaxFee.basisPoints.sub(state.liqPool.lpMinFee.basisPoints), lamports, state.liqPool.lpLiquidityTarget));
    }
}
exports.linearFee = linearFee;
function calcMsolFromLamports(state, stakeLamports) {
    return sharesFromValue(stakeLamports, totalVirtualStakedLamports(state), state.msolSupply);
}
exports.calcMsolFromLamports = calcMsolFromLamports;
function calcLamportsFromMsolAmount(state, msolAmount) {
    return valueFromShares(msolAmount, totalVirtualStakedLamports(state), state.msolSupply);
}
exports.calcLamportsFromMsolAmount = calcLamportsFromMsolAmount;
function totalVirtualStakedLamports(state) {
    return totalLamportsUnderControl(state).sub(state.circulatingTicketBalance);
}
exports.totalVirtualStakedLamports = totalVirtualStakedLamports;
function totalLamportsUnderControl(state) {
    return state.validatorSystem.totalActiveBalance.add(totalCoolingDown(state)).add(state.availableReserveBalance);
}
exports.totalLamportsUnderControl = totalLamportsUnderControl;
function totalCoolingDown(state) {
    return state.stakeSystem.delayedUnstakeCoolingDown.add(state.emergencyCoolingDown);
}
exports.totalCoolingDown = totalCoolingDown;
function valueFromShares(shares, totalValue, totalShares) {
    return proportional(shares, totalValue, totalShares);
}
exports.valueFromShares = valueFromShares;
function sharesFromValue(value, totalValue, totalShares) {
    if (totalValue.toNumber() == 0)
        return value;
    return proportional(value, totalShares, totalValue);
}
exports.sharesFromValue = sharesFromValue;
function proportional(amount, numerator, denominator) {
    if (denominator.toNumber() == 0)
        return amount;
    return amount.mul(numerator).div(denominator);
}
exports.proportional = proportional;
