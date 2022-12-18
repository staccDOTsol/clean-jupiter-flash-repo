"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSerum = exports._loadSerum = exports.loadMarket = void 0;
const serum_1 = require("@project-serum/serum");
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../types/types");
function loadMarket(decoded, programId, tokenMap) {
    const [baseMintDecimals, quoteMintDecimals] = [
        tokenMap[decoded.baseMint].decimals,
        tokenMap[decoded.quoteMint].decimals,
    ];
    return new serum_1.Market(decoded, baseMintDecimals, quoteMintDecimals, {}, programId, null);
}
exports.loadMarket = loadMarket;
function _loadSerum(serumMarkets) {
    try {
        if (!serumMarkets || serumMarkets.length == 0)
            return [];
        let arr = [];
        for (let i = 0; i < serumMarkets.length; i++) {
            arr.push({
                provider: "serum",
                account: serumMarkets[i].asks,
            });
            arr.push({
                provider: "serum",
                account: serumMarkets[i].bids,
            });
        }
        return arr;
    }
    catch (_a) {
        return [];
    }
}
exports._loadSerum = _loadSerum;
function loadSerum(serumMarkets, tokenList, infos) {
    try {
        if (!serumMarkets || serumMarkets.length == 0 || !infos)
            return {};
        if (!infos)
            return {};
        let markets = {};
        let marketList = [];
        for (let i = 0; i < serumMarkets.length; i++) {
            marketList.push(loadMarket(serumMarkets[i], new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3), tokenList));
        }
        marketList.forEach((itemMarket) => {
            if (itemMarket)
                markets[itemMarket.address.toString()] = { market: itemMarket };
        });
        const asksAndBidsAddressToMarket = {};
        for (const [marketAddress, marketConfig] of Object.entries(markets)) {
            // @ts-ignore
            asksAndBidsAddressToMarket[marketConfig.market.asksAddress.toString()] = marketAddress;
            // @ts-ignore
            asksAndBidsAddressToMarket[marketConfig.market.bidsAddress.toString()] = marketAddress;
        }
        infos.forEach((info) => {
            if (info === null)
                return;
            const address = info.publicKey.toString();
            if (!asksAndBidsAddressToMarket[address])
                return;
            const market = asksAndBidsAddressToMarket[address];
            const orderbook = serum_1.Orderbook.decode(markets[market].market, info.account.data);
            const { isBids, slab } = orderbook;
            if (isBids) {
                markets[market].bids = slab;
            }
            else {
                markets[market].asks = slab;
            }
        });
        return markets;
    }
    catch (_a) {
        return {};
    }
}
exports.loadSerum = loadSerum;
