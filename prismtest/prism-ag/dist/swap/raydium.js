"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raydiumSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const types_1 = require("../types/types");
function raydiumSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, poolInfo } = route.routeData;
        const marketVaultSigner = yield web3_js_1.PublicKey.createProgramAddress([new web3_js_1.PublicKey(poolInfo.serumMarket).toBuffer(),
            poolInfo.serumData.vaultSignerNonce.toArrayLike(Buffer, 'le', 8)], new web3_js_1.PublicKey(poolInfo.serumProgramId));
        return program.instruction.raydiumSwap(new bn_js_1.default(route.amountIn * 10 ** fromCoin.decimals), new bn_js_1.default(route.minimumReceived * 10 ** toCoin.decimals), useT ? true : false, disableFees, new bn_js_1.default(hostFees), {
            accounts: {
                raydiumLiquidityPool: new web3_js_1.PublicKey(poolInfo.programId),
                serumDexProgram: new web3_js_1.PublicKey(poolInfo.serumProgramId),
                tokenProgram: new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                raydiumInfo: {
                    ammId: new web3_js_1.PublicKey(poolInfo.ammId),
                    ammAuthority: new web3_js_1.PublicKey(poolInfo.ammAuthority),
                    ammOpenOrders: new web3_js_1.PublicKey(poolInfo.ammOpenOrders),
                    poolCoinTokenAccount: new web3_js_1.PublicKey(poolInfo.poolCoinTokenAccount),
                    poolPcTokenAccount: new web3_js_1.PublicKey(poolInfo.poolPcTokenAccount),
                },
                serumInfo: {
                    market: new web3_js_1.PublicKey(poolInfo.serumMarket),
                    bids: poolInfo.serumData.bids,
                    asks: poolInfo.serumData.asks,
                    eventQueue: poolInfo.serumData.eventQueue,
                    coinVault: poolInfo.serumData.baseVault,
                    pcVault: poolInfo.serumData.quoteVault,
                    vaultSigner: marketVaultSigner,
                },
                authority: user,
                fromTokenAccount: fromTokenAccount,
                toTokenAccount: toTokenAccount,
                feeSweeper: disableFees ? user : fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                host: disableFees ? user : fees.host,
            },
        });
    });
}
exports.raydiumSwap = raydiumSwap;
