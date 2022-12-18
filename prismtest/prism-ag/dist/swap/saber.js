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
exports.saberSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const bn_js_1 = __importDefault(require("bn.js"));
function saberSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, saberInfo } = route.routeData;
        let stableSwap = saberInfo.stableSwap;
        let adminFees = stableSwap.state.tokenA.adminFeeAccount;
        let [inputTokenAccount, outputTokenAccount] = [
            stableSwap.state.tokenB.reserve, stableSwap.state.tokenA.reserve
        ];
        if (fromCoin.mintAddress == stableSwap.state.tokenA.mint.toBase58()) {
            adminFees = stableSwap.state.tokenB.adminFeeAccount;
            [inputTokenAccount, outputTokenAccount] = [
                stableSwap.state.tokenA.reserve, stableSwap.state.tokenB.reserve
            ];
        }
        let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
        let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
        return program.instruction.saberSwap(amountIn, amountOut, useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                saberStableSwap: new web3_js_1.PublicKey('SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ'),
                tokenProgram: new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                clock: new web3_js_1.PublicKey("SysvarC1ock11111111111111111111111111111111"),
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                swapAccount: stableSwap.config.swapAccount,
                swapAuthority: stableSwap.config.authority,
                poolSource: inputTokenAccount,
                poolDestination: outputTokenAccount,
                adminDestination: adminFees,
                authority: user,
                fromTokenAccount: fromTokenAccount,
                toTokenAccount: toTokenAccount,
                feeSweeper: fees.owner,
                host: fees.host,
            },
        });
    });
}
exports.saberSwap = saberSwap;
