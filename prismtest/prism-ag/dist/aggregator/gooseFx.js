"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gooseFxRoute = void 0;
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
function gooseFxRoute(fromCoin, toCoin, fromCoinAmount, option, liquidityData, settings) {
    let gooseFxInfo = liquidityData.gooseFxData[option.swapAccount];
    let fromToken = (0, pubkey_1.findProgramAddressSync)([Buffer.from("GFX-SSL", "utf-8"), new web3_js_1.PublicKey(types_1.GOOSEFX_CONTROLLER).toBuffer(), new web3_js_1.PublicKey(fromCoin.mintAddress).toBuffer()], new web3_js_1.PublicKey(types_1.GOOSEFX_PROGRAM));
    let toToken = (0, pubkey_1.findProgramAddressSync)([Buffer.from("GFX-SSL", "utf-8"), new web3_js_1.PublicKey(types_1.GOOSEFX_CONTROLLER).toBuffer(), new web3_js_1.PublicKey(toCoin.mintAddress).toBuffer()], new web3_js_1.PublicKey(types_1.GOOSEFX_PROGRAM));
    let quoter;
    quoter = gooseFxInfo.quoter0;
    if (fromCoin.mintAddress != gooseFxInfo.mintA) {
        quoter = gooseFxInfo.quoter1;
    }
    let { amountOut: outAmount, impact } = quoter.quote(BigInt(fromCoinAmount * 10 ** fromCoin.decimals));
    let received = parseFloat(outAmount.toString()) / 10 ** toCoin.decimals;
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
        provider: "gooseFX",
        fees: fees,
        priceImpact: impact,
        routeData: {
            gooseFxPool: Object.assign(Object.assign({}, gooseFxInfo), { fromToken: fromToken, toToken: toToken }),
            fromCoin: fromCoin,
            toCoin: toCoin,
        }
    };
}
exports.gooseFxRoute = gooseFxRoute;
