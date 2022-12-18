"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cykuraRoute = void 0;
const sdk_1 = require("@cykura/sdk");
const sdk_core_1 = require("@cykura/sdk-core");
const web3_js_1 = require("@solana/web3.js");
const jsbi_1 = __importDefault(require("jsbi"));
const bn_js_1 = __importDefault(require("bn.js"));
function cykuraRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let info = liquidityData.cykuraData[option.poolAccount];
    let decimalA = fromCoin.decimals, decimalB = toCoin.decimals;
    let inputVault = info.vault0, outputVault = info.vault1;
    let sqrtPriceLimit = new bn_js_1.default(0);
    let amount = info.tokenAmount1;
    if (fromCoin.mintAddress != info.mintA.toBase58()) {
        [decimalA, decimalB] = [decimalB, decimalA];
        [inputVault, outputVault] = [outputVault, inputVault];
        sqrtPriceLimit = new bn_js_1.default(1);
        amount = info.tokenAmount0;
    }
    const poolObject = new sdk_1.Pool(new sdk_core_1.Token(101, info.mintA, 0), new sdk_core_1.Token(101, info.mintB, 0), info.fee, jsbi_1.default.BigInt(info.sqrtPriceX32.toString()), jsbi_1.default.BigInt(info.liquidity.toString()), info.tick, info.tickProvider);
    const quote = poolObject.getOutputAmount(sdk_core_1.CurrencyAmount.fromRawAmount(new sdk_core_1.Token(101, new web3_js_1.PublicKey(fromCoin.mintAddress), 0), jsbi_1.default.BigInt(Math.floor(fromCoinAmount * 10 ** fromCoin.decimals))));
    if (jsbi_1.default.toNumber(quote[0].quotient) > amount)
        return null;
    let outAmount = parseFloat(quote[0].quotient.toString()) / 10 ** toCoin.decimals;
    let totalFees = (settings.owner.fee + settings.host.fee) / 100;
    let fees = {};
    fees[toCoin.symbol] = outAmount * totalFees / 100;
    let amountWithFees = outAmount * (1 - totalFees / 100);
    let priceImpact = (jsbi_1.default.toNumber(poolObject.sqrtRatioX32) - jsbi_1.default.toNumber(quote[1].sqrtRatioX32)) / jsbi_1.default.toNumber(poolObject.sqrtRatioX32);
    priceImpact = priceImpact < 0 ? -priceImpact : priceImpact;
    const outAmountWithSlippage = amountWithFees * (1 - settings.slippage / 100);
    return {
        from: fromCoin.symbol,
        amountIn: fromCoinAmount,
        to: toCoin.symbol,
        amountOut: outAmount,
        amountWithFees: amountWithFees,
        minimumReceived: outAmountWithSlippage,
        provider: "cykura",
        fees: fees,
        priceImpact: priceImpact * 100,
        routeData: {
            cykuraPool: info,
            fromCoin: fromCoin,
            toCoin: toCoin,
            inputVault: inputVault,
            outputVault: outputVault,
            remainingAccounts: quote[2],
            sqrtPriceLimit: sqrtPriceLimit,
        }
    };
}
exports.cykuraRoute = cykuraRoute;
