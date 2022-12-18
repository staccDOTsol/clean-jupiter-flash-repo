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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCrema = void 0;
const crema_sdk_1 = require("@cremafinance/crema-sdk");
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../types/types");
function loadCrema(liquidity, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        if (liquidity.length == 0)
            return {};
        let promises = [];
        for (let i = 0; i < liquidity.length; i++) {
            promises.push(connection.getAccountInfo(liquidity[i].ticksKey));
            promises.push(connection.getAccountInfo(liquidity[i].positionsKey));
        }
        let cremaSwapPromises = [];
        yield Promise.all(promises).then(results => {
            for (let i = 0; i < liquidity.length; i++) {
                let ticksData = (0, crema_sdk_1.parseTicksAccount)(liquidity[i].ticksKey, results[i * 2]);
                let tokenSwap = new crema_sdk_1.TokenSwap(connection, new web3_js_1.PublicKey(types_1.CREMA_PROGRAM_ID), liquidity[i].tokenSwapKey, null);
                tokenSwap.tokenSwapInfo = Object.assign(Object.assign({}, tokenSwap.tokenSwapInfo), liquidity[i]);
                if (ticksData === null || ticksData === void 0 ? void 0 : ticksData.data)
                    tokenSwap.ticks = ticksData.data.ticks;
                tokenSwap.authority = liquidity[i].authority;
                //@ts-ignore
                tokenSwap.tokenSwapKey = ticksData.data.tokenSwapKey;
                cremaSwapPromises.push(tokenSwap.load());
            }
        });
        let cremaSwaps = {};
        yield Promise.all(cremaSwapPromises).then(results => {
            for (let i = 0; i < liquidity.length; i++)
                cremaSwaps[liquidity[i].tokenSwapKey.toString()] = results[i];
        });
        return cremaSwaps;
    });
}
exports.loadCrema = loadCrema;
