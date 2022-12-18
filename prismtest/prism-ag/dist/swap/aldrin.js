"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.aldrinSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const aldrinSDK = __importStar(require("@aldrin_exchange/sdk"));
const bn_js_1 = __importDefault(require("bn.js"));
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
function aldrinSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, aldrinInfo } = route.routeData;
        let poolPublicKey = aldrinInfo.poolPublicKey;
        const poolSigner = (0, pubkey_1.findProgramAddressSync)([poolPublicKey.toBuffer()], aldrinSDK.POOLS_PROGRAM_ADDRESS)[0];
        let [userBase, userQoute] = [fromTokenAccount, toTokenAccount];
        let side = -1;
        if (new web3_js_1.PublicKey(fromCoin.mintAddress).equals(aldrinInfo.quoteTokenMint)) {
            [userBase, userQoute] = [toTokenAccount, fromTokenAccount];
            side = 1;
        }
        return program.instruction.aldrinSwap(new bn_js_1.default(route.amountIn * 10 ** fromCoin.decimals), new bn_js_1.default(route.minimumReceived * 10 ** toCoin.decimals), useT ? true : false, (side == -1) ? new bn_js_1.default(1) : new bn_js_1.default(0), new bn_js_1.default(hostFees), {
            accounts: {
                aldrinLiquidityPool: new web3_js_1.PublicKey('AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6'),
                tokenProgram: new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                poolPublickey: aldrinInfo.poolPublicKey,
                poolSigner: poolSigner,
                poolMint: aldrinInfo.poolMint,
                baseTokenVault: aldrinInfo.baseTokenVault,
                quoteTokenVault: aldrinInfo.quoteTokenVault,
                feePoolTokenAccount: aldrinInfo.feePoolTokenAccount,
                authority: user,
                fromTokenAccount: fromTokenAccount,
                toTokenAccount: toTokenAccount,
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                host: fees.host,
            },
        });
    });
}
exports.aldrinSwap = aldrinSwap;
