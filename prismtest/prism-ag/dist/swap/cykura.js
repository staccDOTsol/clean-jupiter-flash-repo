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
exports.cykuraSwap = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const bn_js_1 = __importDefault(require("bn.js"));
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
const sdk_1 = require("@cykura/sdk");
function cykuraSwap(user, program, route, fromTokenAccount, toTokenAccount, fees, hostFees, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, toCoin, cykuraPool, inputVault, outputVault, remainingAccounts, sqrtPriceLimit } = route.routeData;
        let amountIn = new bn_js_1.default(Math.floor(route.amountIn * 10 ** fromCoin.decimals));
        let amountOut = new bn_js_1.default(Math.floor(route.minimumReceived * 10 ** toCoin.decimals));
        const lastObservationState = (0, pubkey_1.findProgramAddressSync)([sdk_1.OBSERVATION_SEED, cykuraPool.mintA.toBuffer(), cykuraPool.mintB.toBuffer(),
            (0, sdk_1.u32ToSeed)(cykuraPool.fee), (0, sdk_1.u16ToSeed)(cykuraPool.observationIndex)], new web3_js_1.PublicKey(types_1.CYKURA_PROGRAM_ID))[0];
        const nextObservationState = (0, pubkey_1.findProgramAddressSync)([sdk_1.OBSERVATION_SEED, cykuraPool.mintA.toBuffer(), cykuraPool.mintB.toBuffer(),
            (0, sdk_1.u32ToSeed)(cykuraPool.fee), (0, sdk_1.u16ToSeed)((cykuraPool.observationIndex + 1) % cykuraPool.observationCardinalityNext)], new web3_js_1.PublicKey(types_1.CYKURA_PROGRAM_ID))[0];
        let allRemainingAccounts = [];
        allRemainingAccounts.push({
            pubkey: new web3_js_1.PublicKey(cykuraPool.poolAccount),
            isSigner: false,
            isWritable: true,
        });
        allRemainingAccounts.push({
            pubkey: toTokenAccount,
            isSigner: false,
            isWritable: true,
        });
        allRemainingAccounts.push({
            pubkey: inputVault,
            isSigner: false,
            isWritable: true,
        });
        allRemainingAccounts.push({
            pubkey: outputVault,
            isSigner: false,
            isWritable: true,
        });
        allRemainingAccounts.push({
            pubkey: lastObservationState,
            isSigner: false,
            isWritable: true,
        });
        // add remainingAccounts
        let bitmapNum = 0;
        for (let i = 0; i < remainingAccounts.length; i++) {
            if (remainingAccounts[i].isWritable == false)
                bitmapNum++;
            allRemainingAccounts.push(remainingAccounts[i]);
        }
        allRemainingAccounts.push({
            pubkey: nextObservationState,
            isSigner: false,
            isWritable: true,
        });
        return program.instruction.cykuraSwap(amountIn, amountOut, bitmapNum, new bn_js_1.default(Date.now() / 1000 + 100000), useT ? true : false, new bn_js_1.default(hostFees), {
            accounts: {
                signer: user,
                factoryState: new web3_js_1.PublicKey(types_1.CYKURA_FACTORY_STATE_ADDRESS),
                source: fromTokenAccount,
                coreProgram: new web3_js_1.PublicKey(types_1.CYKURA_PROGRAM_ID),
                tokenProgram: new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID),
                systemProgram: web3_js_1.SystemProgram.programId,
                host: fees.host,
                feeSweeper: fees.owner,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
            },
            remainingAccounts: allRemainingAccounts,
        });
    });
}
exports.cykuraSwap = cykuraSwap;
