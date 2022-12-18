"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aldrinRoute = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
function aldrinRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let aldrinInfo = liquidityData.aldrinData[option.poolPublicKey.toBase58()];
    if (aldrinInfo.poolVersion == 2)
        return { amountOut: 0 };
    let fromMint = fromCoin.mintAddress;
    let toMint = toCoin.mintAddress;
    let baseTokenVault = aldrinInfo.baseVaultInfo;
    let quoteTokenVault = aldrinInfo.quoteVaultInfo;
    let beforeX = baseTokenVault.amount;
    let beforeY = quoteTokenVault.amount;
    const constValue = beforeX.mul(beforeY);
    let bestPrice = beforeY.toNumber() / beforeX.toNumber();
    let fromAmount = new bn_js_1.default(fromCoinAmount * 10 ** fromCoin.decimals);
    let fromAmountAfterFees = fromAmount
        .mul(new bn_js_1.default(aldrinInfo.fees.ownerTradeFeeDenominator)
        .mul(new bn_js_1.default(aldrinInfo.fees.tradeFeeDenominator))
        .sub((new bn_js_1.default(aldrinInfo.fees.ownerTradeFeeNumerator)
        .mul(new bn_js_1.default(aldrinInfo.fees.tradeFeeDenominator))).add((new bn_js_1.default(aldrinInfo.fees.tradeFeeNumerator)
        .mul(new bn_js_1.default(aldrinInfo.fees.ownerTradeFeeDenominator)))))).div(new bn_js_1.default(aldrinInfo.fees.ownerTradeFeeDenominator)
        .mul(new bn_js_1.default(aldrinInfo.fees.tradeFeeDenominator)));
    if (fromMint == baseTokenVault.mint.toBase58() && toMint == quoteTokenVault.mint.toBase58()) {
        const afterX = beforeX.add(fromAmountAfterFees);
        const afterY = constValue.div(afterX);
        const outAmount = beforeY.sub(afterY);
        let amountOut = (outAmount.toNumber() / 10 ** toCoin.decimals);
        let totalFees = (settings.owner.fee + settings.host.fee) / 100;
        let fees = {};
        fees[toCoin.symbol] = amountOut * totalFees / 100,
            amountOut = amountOut * (1 - totalFees / 100);
        let amountOutWithSlippage = amountOut * (1 - settings.slippage / 100);
        let worstPrice = afterY.toNumber() / afterX.toNumber();
        return {
            from: fromCoin.symbol,
            amountIn: fromCoinAmount,
            to: toCoin.symbol,
            amountOut: amountOut,
            minimumReceived: amountOutWithSlippage,
            provider: "aldrin",
            fees: fees,
            priceImpact: 100 * (bestPrice - worstPrice) / bestPrice,
            routeData: {
                aldrinInfo: aldrinInfo,
                fromCoin: fromCoin,
                toCoin: toCoin,
            }
        };
    }
    else {
        const afterY = beforeY.add(fromAmountAfterFees);
        const afterX = constValue.div(afterY);
        const outAmount = beforeX.sub(afterX);
        let amountOut = outAmount.toNumber() / 10 ** toCoin.decimals;
        let totalFees = (settings.owner.fee + settings.host.fee) / 100;
        let fees = {};
        fees[toCoin.symbol] = amountOut * totalFees / 100;
        let amountWithFees = amountOut * (1 - totalFees / 100);
        let amountOutWithSlippage = amountWithFees * (1 - settings.slippage / 100);
        let worstPrice = afterY.toNumber() / afterX.toNumber();
        return {
            from: fromCoin.symbol,
            amountIn: fromCoinAmount,
            to: toCoin.symbol,
            amountOut: amountOut,
            amountWithFees: amountWithFees,
            minimumReceived: amountOutWithSlippage,
            provider: "aldrin",
            fees: fees,
            priceImpact: 100 * (worstPrice - bestPrice) / bestPrice,
            routeData: {
                aldrinInfo: aldrinInfo,
                fromCoin: fromCoin,
                toCoin: toCoin,
            }
        };
    }
}
exports.aldrinRoute = aldrinRoute;
