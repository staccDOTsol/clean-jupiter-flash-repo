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
exports.getSerumMarkets = exports.getSerumCacheData = void 0;
const market_1 = require("@project-serum/serum/lib/market");
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../types/types");
const common_1 = require("./common");
function getSerumCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const serum = { all: {} };
            let marketInfos = yield (0, common_1.getFilteredProgramAccountsAmmOrMarketCache)('market', connection, new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3), [{ dataSize: market_1.MARKET_STATE_LAYOUT_V2.span }]).catch(() => []);
            return {
                marketInfos: marketInfos,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getSerumCacheData = getSerumCacheData;
function getSerumMarkets(data) {
    try {
        const serum = { all: {} };
        let marketInfos = data.marketInfos;
        marketInfos.forEach((marketInfo) => {
            let market = Object.assign(Object.assign({}, market_1.MARKET_STATE_LAYOUT_V2.decode(marketInfo.accountInfo.data)), { provider: "serum" });
            serum.all[marketInfo.publicKey.toBase58()] = market;
            let coinMint = market.quoteMint.toBase58();
            let pcMint = market.baseMint.toBase58();
            //console.log(coinMint)
            //console.log(pcMint)
            (serum[coinMint] || (serum[coinMint] = [])).push(Object.assign(Object.assign({}, market), { other: pcMint }));
            (serum[pcMint] || (serum[pcMint] = [])).push(Object.assign(Object.assign({}, market), { other: coinMint }));
        });
        return serum;
    }
    catch (_a) {
        return {};
    }
}
exports.getSerumMarkets = getSerumMarkets;
