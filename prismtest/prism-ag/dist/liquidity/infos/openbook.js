"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOpenbook = exports._loadOpenbook = exports.loadMarket = void 0;
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
function _loadOpenbook(openbookMarkets) {
    try {
        if (!openbookMarkets || openbookMarkets.length == 0)
            return [];
        let arr = [];
        for (let i = 0; i < openbookMarkets.length; i++) {
            arr.push({
                provider: "openbook",
                account: openbookMarkets[i].asks,
            });
            arr.push({
                provider: "openbook",
                account: openbookMarkets[i].bids,
            });
        }
        return arr;
    }
    catch (_a) {
        return [];
    }
}
exports._loadOpenbook = _loadOpenbook;
function loadOpenbook(openbookMarkets, tokenList, infos) {
    try {
        if (!openbookMarkets || openbookMarkets.length == 0 || !infos)
            return {};
        if (!infos)
            return {};
        let markets = {};
        let marketList = [];
        for (let i = 0; i < openbookMarkets.length; i++) {
            marketList.push(loadMarket(openbookMarkets[i], new web3_js_1.PublicKey(types_1.OPENBOOK_PROGRAM_ID), tokenList));
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
exports.loadOpenbook = loadOpenbook;
