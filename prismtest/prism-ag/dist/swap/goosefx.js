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
exports.findAssociatedTokenAddress = exports.gooseFxSwap = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const types_1 = require("../types/types");
function gooseFxSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, preTransaction, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, gooseFxPool } = route.routeData;
        let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
        let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
        let { oracles, nOracle, feeCollector, fromToken, toToken } = gooseFxPool;
        const n = Number(nOracle.toString());
        const remainingAccounts = [];
        for (const oracle of oracles.slice(0, n)) {
            for (const elem of oracle.elements.slice(0, Number(oracle.n))) {
                remainingAccounts.push({
                    isSigner: false,
                    isWritable: false,
                    pubkey: elem.address,
                });
            }
        }
        fromToken = fromToken[0];
        toToken = toToken[0];
        return program.instruction.goosefxSwap(amountIn, amountOut, useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                goosefxProgram: new web3_js_1.PublicKey(types_1.GOOSEFX_PROGRAM),
                controller: new web3_js_1.PublicKey(types_1.GOOSEFX_CONTROLLER),
                pair: new web3_js_1.PublicKey(gooseFxPool.swapAccount),
                sslIn: fromToken,
                sslOut: toToken,
                liabilityVaultIn: findAssociatedTokenAddress(fromToken, new web3_js_1.PublicKey(fromCoin.mintAddress)),
                liabilityVaultOut: findAssociatedTokenAddress(fromToken, new web3_js_1.PublicKey(toCoin.mintAddress)),
                swappedLiabilityVaultIn: findAssociatedTokenAddress(toToken, new web3_js_1.PublicKey(toCoin.mintAddress)),
                swappedLiabilityVaultOut: findAssociatedTokenAddress(toToken, new web3_js_1.PublicKey(fromCoin.mintAddress)),
                userSourceTokenAccount: fromTokenAccount,
                userDestinationTokenAccount: toTokenAccount,
                feeCollectorAta: findAssociatedTokenAddress(feeCollector, new web3_js_1.PublicKey(fromCoin.mintAddress)),
                user: user,
                feeCollector: feeCollector,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                host: fees.host,
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
            },
            remainingAccounts: remainingAccounts,
        });
    });
}
exports.gooseFxSwap = gooseFxSwap;
function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return web3_js_1.PublicKey.findProgramAddressSync([
        walletAddress.toBuffer(),
        spl_token_1.TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
    ], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID)[0];
}
exports.findAssociatedTokenAddress = findAssociatedTokenAddress;
;
