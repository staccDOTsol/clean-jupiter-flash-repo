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
exports.getSaberPools = exports.getSaberCacheData = void 0;
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const types_1 = require("../../types/types");
const getMultInfo_1 = require("../../utils/getMultInfo");
function getSaberCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let swaps = (yield axios_1.default.get(types_1.SABER_SWAPS).catch(() => { return { data: [] }; })).data;
            let pools = {};
            let accounts = [];
            for (let i = 0; i < swaps.length; i++) {
                accounts.push(new web3_js_1.PublicKey(swaps[i].addresses.swapAccount));
            }
            let result = yield (0, getMultInfo_1.customGetMultipleAccountInfos)(connection, accounts, "Saber init providers");
            return {
                swaps: swaps,
                result: result,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getSaberCacheData = getSaberCacheData;
function getSaberPools(data) {
    try {
        let swaps = data.swaps;
        let pools = {};
        let accounts = [];
        for (let i = 0; i < swaps.length; i++) {
            accounts.push(new web3_js_1.PublicKey(swaps[i].addresses.swapAccount));
        }
        let result = data.result;
        for (let i = 0; i < swaps.length; i++) {
            let swap = Object.assign(Object.assign({}, swaps[i]), { swapAccountData: result[i], provider: "saber" });
            let coinMint = swap.underlyingTokens[0];
            let pcMint = swap.underlyingTokens[1];
            console.log(coinMint)
            console.log(pcMint)
            (pools[coinMint] || (pools[coinMint] = [])).push(Object.assign(Object.assign({}, swap), { other: pcMint }));
            (pools[pcMint] || (pools[pcMint] = [])).push(Object.assign(Object.assign({}, swap), { other: coinMint }));
        }
        return pools;
    }
    catch (_a) {
        return {};
    }
}
exports.getSaberPools = getSaberPools;
