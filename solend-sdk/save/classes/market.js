"use strict";
// @ts-nocheck
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
exports.SolendMarket = void 0;
const web3_js_1 = require("@solana/web3.js");
const obligation_1 = require("./obligation");
const reserve_1 = require("./reserve");
const obligation_2 = require("../state/obligation");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const API_ENDPOINT = "https://api.solend.fi";
class SolendMarket {
    constructor(connection, config, reserves, programId) {
        this.connection = connection;
        this.reserves = reserves;
        this.rewardsData = null;
        this.config = config;
        this.programId = programId;
    }
    static initialize(connection, environment = "production", marketAddress) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const config = [
                {
                  "name": "main",
                  "address": "F8dCQofhBuspm1sVsrfr8NReJvGn1JfiR9xARnUBQgo1",
                  "authorityAddress": "HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV",
                  "reserves": [
                    {
                      "asset": "SOL",
                      "liquidityToken":{
                      "mint": "So11111111111111111111111111111111111111112",
                      "decimals": 9,
                      "assetPriceUSD": 30},
                      "address": "fuSA8HSSku7BwRsVFWotGcVpwH3QrGtnhqWRS4orhXG",
                      "collateralMintAddress": "44PeAshzRSmhzQ3Da9z22YXYRN18PfsTHVXZpcQ7p7TH",
                      "jareMint": "7yN93TFSCZqseppJyxXjnAnps7wH1wRtvgemFXksc25t",
                      "collateralSupplyAddress": "A8aUS1MBosuSLXwfP16iYL3VgJvPKhLGwGzvpuieRTvJ",
                      "liquidityAddress": "CBH6VFEhBatZ265jrfKDMey5NQgMZhedk7piu5BCDYfW",
                      "liquidityFeeReceiverAddress": "wwQZH2vvWqiqwudoQYQ5RydW2CkgD5FApgD6f92KqHb",
                      "userSupplyCap": 4,
                      "reserveSupplyCap": 40000
                    },
                    {
                      "asset": "USDC",
                      "liquidityToken":{
                      "decimals": 6,
                      "assetPriceUSD": 1,
                      "mint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},
                      "address": "5guv5xt2we2FpPXkSPN8oaz6C876NjiV62Np5RxghDnb",
                      "collateralMintAddress": "CnwtgyFcTyuQMKDSU1KCXVS4jPksjJUVQaMkgZ2WU3ny",
                      "jareMint": "2DvSLHu3HDTDEdWnYETdTtuywTvenmVQpsvn5ybEbKpA",
                      "collateralSupplyAddress": "HxL7nx79BLBwjGKAmnSYPhxdbPCpzHqj7UVb1ni3iUFC",
                      "liquidityAddress": "Ho9gUv6Y5KKZzxat5pbnf2skppcVpniss6zrabhWwi1n",
                      "liquidityFeeReceiverAddress": "8c5tAQAobrRyHgtLZJyaprLjv4yyL5YPEqS2S4wqD9UR",
                      "userSupplyCap": 10000,
                      "reserveSupplyCap": 1000000
                    },
                    {
                      "asset": "COPE",
                      "liquidityToken":{
                      "decimals": 6,
                      "assetPriceUSD": 0.05,
                      "mint":"8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh"},
                      "address": "CoQgPXDKkBo84K14uFbGqkNmXHjKLYXt6d4BvLY6LWpu",
                      "collateralMintAddress": "EHSug7WuXkoPDaeF2Cog4mcZ6SKZ5iJ1rkXFoczrXWqL",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "4RjkXaYqrKX8pd5t9RvPt4UmhyzuXjKT25ysXWQD2V56",
                      "liquidityAddress": "6q7eZ2XBkgrwRpWnaVct6aRTKV9zmiGgXYuCQs4BQsjh",
                      "liquidityFeeReceiverAddress": "47AV9KQgT8MxFrBnQC5uGK56NLQRMZPgze4G4i4sgGzJ",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    },
                    {
                      "asset": "DAI",
                      "liquidityToken":{
                      "decimals": 8,
                      "assetPriceUSD": 1,
                      "mint":"EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCWNWqxWV4J6o"},
                      "address": "GkwFTuAEqDG1seWeSy1htLpkaSjMdqhuMSEvwWjDB4xX",
                      "collateralMintAddress": "J4vUxcsHkoWudqWhooDxzx9aoHrXtZ73qj9DtQSqqwwS",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "4dKHbXHDc13XpstSPo9chs3vvXQxjbtYb97ueppgA4JG",
                      "liquidityAddress": "5rpiCSbB2eNb9v2JZj8dxKSgE3gQWguB3uigtG6W8cCq",
                      "liquidityFeeReceiverAddress": "5rpiCSbB2eNb9v2JZj8dxKSgE3gQWguB3uigtG6W8cCq",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    },
                    {
                      "asset": "USDH",
                      "liquidityToken":{
                      "decimals": 6,
                      "assetPriceUSD": 1,
                      "mint":"USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX"},
                      "address": "78w9qRtdCQ6zWNUGnZxk6p36sdzuutHCtMQCJM4bKyAW",
                      "collateralMintAddress": "EESxsxPQzzPLw33FcKq5saQAt1y65FDSsKfJA6R4JDyk",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "4CTXun1cgPYmb2WigPZB5YBtFGzCnaC4L3CSqqmYD8L8",
                      "liquidityAddress": "5D3wK5tHv6j93ptawdYuGYhpxgjtagbLnhBWqrV57DRw",
                      "liquidityFeeReceiverAddress": "EbEa9dr2seUxpgYuCCmWdopnkhboMHJ1ubPEen6H23ez",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    },
                    {
                      "asset": "PAI",
                      "liquidityToken":{
                      "decimals": 6,
                      "assetPriceUSD": 1,
                      "mint":"Ea5SjE2Y6yvCeW5dYTn7PYMuW5ikXkvbGdcmSnXeaLjS"},
                      "address": "DHP6TaqV9kafmg3ooqbvWPwzeMvtwphTzFShnjBNzRsp",
                      "collateralMintAddress": "EUiemqKoJEUxTr4wtBZdqkBCWwk8qutKpprUDVSDFbbr",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "6uWfWV8kZUPDjLVAxDoAomVXrasykgwgRXZRJhWZBdBH",
                      "liquidityAddress": "6X3mfHU9FiimfF1VinUS2g1mX9LBvgywi5fRtLqnno85",
                      "liquidityFeeReceiverAddress": "6X3mfHU9FiimfF1VinUS2g1mX9LBvgywi5fRtLqnno85",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    },
                    {
                      "asset": "USDT",
                      "liquidityToken":{
                      "decimals": 6,
                      "assetPriceUSD": 1,
                      "mint":"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},
                      "address": "5EmzXiKYz3skJS3PSzj9BScdbxQ8huH3CfV6f68LUZGk",
                      "collateralMintAddress": "4kKNXxKRx2EdDnRU4beS9JBnuD5cMTL1BQ8WK2iZVoeu",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "9UfnnuvLd13yw7vvCR5r3EW7Pbgkam1eR87fDkfSQ383",
                      "liquidityAddress": "8PckZa5Yz2tR4zK7vyzqBC6pehHzfUipdGPP9ggwQasP",
                      "liquidityFeeReceiverAddress": "8PckZa5Yz2tR4zK7vyzqBC6pehHzfUipdGPP9ggwQasP",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    },
                    {
                      "asset": "UXD",
                      "liquidityToken":{
                      "decimals": 6,
                      "assetPriceUSD": 1,
                      "mint":"7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT"},
                      "address": "9kB2wr3bKEb5ahMKZNLXPPod5zw3TKYj6BxMPC7SPWpR",
                      "collateralMintAddress": "DhjKo3rteKS8W2BxbdwiofRZpaSQynTt7k5zu4jYv8Fo",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "2Ent5MByfvbGCKpksQwvXG1ugwJripceDMTAuUWkqmhp",
                      "liquidityAddress": "6v4MfzUcNE7U4jWdZigXAyAMpf8kjfLPhpzRAQJHEkFN",
                      "liquidityFeeReceiverAddress": "6v4MfzUcNE7U4jWdZigXAyAMpf8kjfLPhpzRAQJHEkFN",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    },
                    {
                      "asset": "xUSD",
                      "liquidityToken":{
                      "decimals": 6,
                      "assetPriceUSD": 1,
                      "mint":"83LGLCm7QKpYZbX8q4W2kYWbtt8NJBwbVwEepzkVnJ9y"},
                      "address": "BaTPg1VNoxK86wDZCWfMMdohQH1tdMx326sS2eswZNhb",
                      "collateralMintAddress": "5UtPVrTGZN2qc5vLeMPXthVxQuEjqkvW15NHSqtPhPX5",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "GsChWtokr1uVAESEMozAhMWwG2oMuv1HrfXSS1kTy8YN",
                      "liquidityAddress": "53goDCNsdDcKADfy2EQRfiY3C9jewoMz5te3tw2TgfXV",
                      "liquidityFeeReceiverAddress": "53goDCNsdDcKADfy2EQRfiY3C9jewoMz5te3tw2TgfXV",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    },
                    {
                      "asset": "USH",
                      "liquidityToken":{
                      "decimals": 9,
                      "assetPriceUSD": 1,
                      "mint":"9iLH8T7zoWhY7sBmj1WK9ENbWdS1nL8n9wAxaeRitTa6"
                      },"address": "5MRaCd2mVqgT67sTBzRTUZChgCESot51zdApWCpAeb7h",
                      "collateralMintAddress": "HYdzX8u6GUE2JrnBxpLocquPRmkZbr5UDAmax2orU65c",
                      "jareMint": "kALzvjmLZSWMJMQj1bgdKT9hb3VLCKbnZ8uiPyjU4FJ",
                      "collateralSupplyAddress": "2FFQZiYsqDxHHEZJxu2b7tQa3mgrnftUVaPj97RFpgeq",
                      "liquidityAddress": "Ck92WGWDJWWSUZRMxEpvMinF3UG7FfKDDroeSAYkeFfi",
                      "liquidityFeeReceiverAddress": "Ck92WGWDJWWSUZRMxEpvMinF3UG7FfKDDroeSAYkeFfi",
                      "userSupplyCap": 2500,
                      "reserveSupplyCap": 300000
                    }
                  ]
                }];
            this.reserves = config.reserves
            let marketConfig;
            if (marketAddress) {
                marketConfig =
                    (_a = config.find((market) => market.address == marketAddress)) !== null && _a !== void 0 ? _a : null;
                if (!marketConfig) {
                    throw `market address not found: ${marketAddress}`;
                }
            }
            else {
                marketConfig = (_b = config.find((market) => market.isPrimary)) !== null && _b !== void 0 ? _b : config[0];
            }
            const reserves = marketConfig.reserves.map((res) => new reserve_1.SolendReserve(res, connection));
            return new SolendMarket(connection, marketConfig, reserves, (0, constants_1.getProgramId)(environment));
        });
    }
    fetchObligationByWallet(publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const { config, reserves } = this;
            if (!config) {
                throw Error("Market must be initialized to call initialize.");
            }
            const obligationAddress = yield web3_js_1.PublicKey.createWithSeed(publicKey, config.address.slice(0, 32), this.programId);
            const rawObligationData = yield this.connection.getAccountInfo(obligationAddress);
            if (!rawObligationData) {
                return null;
            }
            const parsedObligation = (0, obligation_2.parseObligation)(web3_js_1.PublicKey.default, rawObligationData);
            if (!parsedObligation) {
                throw Error("Could not parse obligation.");
            }
            if (!reserves.every((reserve) => reserve.stats)) {
                yield this.loadReserves();
            }
            const obligationInfo = parsedObligation.info;
            return new obligation_1.SolendObligation(publicKey, obligationAddress, obligationInfo, reserves);
        });
    }
    loadAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [this.loadReserves(), this.loadRewards()];
            yield Promise.all(promises);
        });
    }
    loadExternalRewardData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield axios_1.default.get(`${API_ENDPOINT}/liquidity-mining/external-reward-stats-v2?flat=true`)).data;
            return data;
        });
    }
    loadPriceData(symbols) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield (yield axios_1.default.get(`${API_ENDPOINT}/v1/prices/?symbols=${symbols.join(",")}`)).data);
            return data.results.reduce((acc, price) => (Object.assign(Object.assign({}, acc), { [price.identifier]: Number(price.price) })), {});
        });
    }
    getLatestRewardRate(rewardRates, slot) {
        return rewardRates
            .filter((rr) => slot >= rr.beginningSlot)
            .reduce((v1, v2) => (v1.beginningSlot > v2.beginningSlot ? v1 : v2), {
            beginningSlot: 0,
            rewardRate: "0",
        });
    }
    loadRewards() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config) {
                throw Error("Market must be initialized to call loadRewards.");
            }
            const promises = [
                this.loadExternalRewardData(),
                this.connection.getSlot("finalized"),
            ];
            const [externalRewards, currentSlot] = yield Promise.all(promises);
            const querySymbols = [
                ...new Set(externalRewards.map((reward) => reward.rewardSymbol)),
            ];
            const priceData = yield this.loadPriceData(querySymbols.concat("SLND"));
            this.rewardsData = this.reserves.reduce((acc, reserve) => {
                const supply = [
                    ...externalRewards
                        .filter((externalReward) => externalReward.reserveID === reserve.config.address &&
                        externalReward.side === "supply")
                        .map((externalReward) => ({
                        rewardRate: this.getLatestRewardRate(externalReward.rewardRates, currentSlot).rewardRate,
                        rewardMint: externalReward.rewardMint,
                        rewardSymbol: externalReward.rewardSymbol,
                        price: priceData[externalReward.rewardSymbol],
                    })),
                ].filter(Boolean);
                const borrow = [
                    ...externalRewards
                        .filter((externalReward) => externalReward.reserveID === reserve.config.address &&
                        externalReward.side === "borrow")
                        .map((externalReward) => ({
                        rewardRate: this.getLatestRewardRate(externalReward.rewardRates, currentSlot).rewardRate,
                        rewardMint: externalReward.rewardMint,
                        rewardSymbol: externalReward.rewardSymbol,
                        price: priceData[externalReward.rewardSymbol],
                    })),
                ].filter(Boolean);
                return Object.assign(Object.assign({}, acc), { [reserve.mint]: {
                        supply,
                        borrow,
                    } });
            }, {});
            const refreshReserves = this.reserves.map((reserve) => {
                var _a;
                return reserve.load((_a = this.rewardsData) !== null && _a !== void 0 ? _a : undefined);
            });
            yield Promise.all(refreshReserves);
        });
    }
    loadReserves() {
        return __awaiter(this, void 0, void 0, function* () {
            const addresses = this.reserves.map((reserve) => new web3_js_1.PublicKey(reserve.config.address));
            const reserveAccounts = yield this.connection.getMultipleAccountsInfo(addresses, "processed");
            const loadReserves = this.reserves.map((reserve, index) => {
                reserve.setBuffer(reserveAccounts[index]);
                return reserve.load();
            });
            yield Promise.all(loadReserves);
        });
    }
    refreshAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [
                this.reserves.every((reserve) => reserve.stats)
                    ? this.loadReserves()
                    : null,
                this.rewardsData ? this.loadRewards() : null,
            ].filter((x) => x);
            yield Promise.all(promises);
        });
    }
}
exports.SolendMarket = SolendMarket;
