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
exports.getBalansolPools = exports.getBalansolCacheData = void 0;
const helper_1 = require("./Balansol/helper");
function getBalansolCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let markets = yield (0, helper_1.getBalansolMarkets)(connection);
            return {
                markets: markets,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getBalansolCacheData = getBalansolCacheData;
function getBalansolPools(data) {
    try {
        let markets = data.markets;
        let pools = {};
        for (let i = 0; i < markets.length; i++) {
            let pool = markets[i].data;
            for (let fir = 0; fir < pool.mints.length; fir++) {
                for (let sec = 0; sec < pool.mints.length; sec++)
                    if (fir != sec) {
                        (pools[pool.mints[fir].toBase58()] || (pools[pool.mints[fir].toBase58()] = [])).push(Object.assign(Object.assign({}, markets[i]), { provider: "balansol", poolAddress: markets[i].pubkey, other: pool.mints[sec].toBase58() }));
                    }
            }
        }
        return pools;
    }
    catch (_a) {
        return {};
    }
}
exports.getBalansolPools = getBalansolPools;
