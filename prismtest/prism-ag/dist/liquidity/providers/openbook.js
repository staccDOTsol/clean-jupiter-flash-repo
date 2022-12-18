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
exports.getOpenbookMarkets = exports.getOpenbookCacheData = void 0;
const market_1 = require("@project-serum/serum/lib/market");
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../types/types");
const common_1 = require("./common");
function getOpenbookCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const openbook = { all: {} };
            let marketInfos = yield (0, common_1.getFilteredProgramAccountsAmmOrMarketCache)('openbook', connection, new web3_js_1.PublicKey(types_1.OPENBOOK_PROGRAM_ID), [{ dataSize: market_1.MARKET_STATE_LAYOUT_V2.span }]).catch(() => []);
            return {
                marketInfos: marketInfos,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getOpenbookCacheData = getOpenbookCacheData;
function getOpenbookMarkets(data) {
    try {
        const openbook = {};
        let marketInfos = data.marketInfos;
        marketInfos.forEach((marketInfo) => {
            let market = Object.assign(Object.assign({}, market_1.MARKET_STATE_LAYOUT_V2.decode(marketInfo.accountInfo.data)), { provider: "openbook" });
            let coinMint = market.quoteMint.toBase58();
            let pcMint = market.baseMint.toBase58();
            //console.log(coinMint)
            //console.log(pcMint)
            (openbook[coinMint] || (openbook[coinMint] = [])).push(Object.assign(Object.assign({}, market), { other: pcMint }));
            (openbook[pcMint] || (openbook[pcMint] = [])).push(Object.assign(Object.assign({}, market), { other: coinMint }));
        });
        return openbook;
    }
    catch (_a) {
        return {};
    }
}
exports.getOpenbookMarkets = getOpenbookMarkets;
