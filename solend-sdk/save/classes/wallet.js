"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.SolendWallet = void 0;
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
const claim_1 = require("./claim");
const anchor = __importStar(require("@project-serum/anchor"));
const spl_token_1 = require("@solana/spl-token");
const psy_american_1 = require("@mithraic-labs/psy-american");
const merkle_distributor_1 = require("../utils/merkle_distributor");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const API_ENDPOINT = "https://api.solend.fi";
class SolendWallet {
    constructor(wallet, connection, environment) {
        this.config = null;
        this.rewards = {};
        this.provider = new anchor.AnchorProvider(connection, wallet, {});
        this.programId = (0, constants_1.getProgramId)(environment);
    }
    static initialize(wallet, connection, environment = "production") {
        return __awaiter(this, void 0, void 0, function* () {
            const loadedWallet = new SolendWallet(wallet, connection, environment);
            const config = (yield (yield axios_1.default.get(`${API_ENDPOINT}/v1/markets/configs?scope=all&deployment=${environment}`)).data);
            loadedWallet.config = config;
            yield loadedWallet.loadRewards();
            return loadedWallet;
        });
    }
    loadRewards() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config) {
                throw Error("Wallet must be initialized to call loadRewards.");
            }
            const anchorProgram = new anchor.Program(merkle_distributor_1.MerkleDistributorJSON, new web3_js_1.PublicKey(merkle_distributor_1.MERKLE_PROGRAM_ID), this.provider);
            const psyOptionsProgram = new anchor.Program(psy_american_1.PsyAmericanIdl, new web3_js_1.PublicKey("R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs"), this.provider);
            const externalStatResponse = (yield axios_1.default.get(`${API_ENDPOINT}/liquidity-mining/external-reward-stats-v2?flat=true`)).data;
            const externalScoreResponse = (yield axios_1.default.get(`${API_ENDPOINT}/liquidity-mining/external-reward-score-v2?wallet=${this.provider.wallet.publicKey.toBase58()}`)).data;
            const primaryMarketSeed = this.config
                .find((market) => market.isPrimary)
                .address.slice(0, 32);
            const obligationAddress = yield web3_js_1.PublicKey.createWithSeed(this.provider.wallet.publicKey, primaryMarketSeed, new web3_js_1.PublicKey(this.programId));
            const claimResponse = (yield axios_1.default.get(`${API_ENDPOINT}/liquidity-mining/reward-proofs?obligation=${obligationAddress}`)).data;
            const [externalStatData, externalScoreData, claimData] = yield Promise.all([
                externalStatResponse,
                externalScoreResponse,
                claimResponse,
            ]);
            const optionMarkets = yield Promise.all(claimData.map((d) => d.optionMarketKey
                ? (0, psy_american_1.getOptionByKey)(psyOptionsProgram, new web3_js_1.PublicKey(d.optionMarketKey))
                : Promise.resolve(null)));
            const optionAtas = yield Promise.all(optionMarkets.map((om) => om
                ? spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(om.optionMint), this.provider.wallet.publicKey, true)
                : Promise.resolve(new web3_js_1.PublicKey("nu11111111111111111111111111111111111111111"))));
            const optionBalances = yield this.provider.connection.getMultipleAccountsInfo(optionAtas);
            const parsedOptionBalances = optionBalances.map((om) => om ? spl_token_1.AccountLayout.decode(om.data) : null);
            const merkleDistributors = (yield anchorProgram.account.merkleDistributor.fetchMultiple(claimData.map((d) => d.distributorPublicKey)));
            const claimAndBumps = yield Promise.all(claimData.map((d) => __awaiter(this, void 0, void 0, function* () {
                const claimAndBump = yield web3_js_1.PublicKey.findProgramAddress([
                    anchor.utils.bytes.utf8.encode("ClaimStatus"),
                    new anchor.BN(d.index).toArrayLike(Buffer, "le", 8),
                    new web3_js_1.PublicKey(d.distributorPublicKey).toBytes(),
                ], new web3_js_1.PublicKey(merkle_distributor_1.MERKLE_PROGRAM_ID));
                return claimAndBump;
            })));
            const claimStatuses = (yield anchorProgram.account.claimStatus.fetchMultiple(claimAndBumps.map((candb) => candb[0])));
            const fullData = yield Promise.all(claimData.map((d, index) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const [distributorATAPublicKey, _bump] = yield web3_js_1.PublicKey.findProgramAddress([
                    new web3_js_1.PublicKey(d.distributorPublicKey).toBuffer(),
                    spl_token_1.TOKEN_PROGRAM_ID.toBuffer(),
                    merkleDistributors[index].mint.toBuffer(),
                ], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
                const claimable = (yield this.provider.connection.getTokenAccountBalance(distributorATAPublicKey)).value.amount !== "0";
                const om = optionMarkets[index];
                return Object.assign(Object.assign({}, d), { optionMarket: om
                        ? Object.assign(Object.assign({}, om), { userBalance: ((_a = parsedOptionBalances[index]) === null || _a === void 0 ? void 0 : _a.amount)
                                ? spl_token_1.u64
                                    .fromBuffer((_b = parsedOptionBalances[index]) === null || _b === void 0 ? void 0 : _b.amount)
                                    .toNumber()
                                : 0, expired: om.expirationUnixTimestamp.toNumber() <=
                                Math.floor(new Date().getTime()) / 1000 }) : null, claimable, claimedAt: (_c = claimStatuses[index]) === null || _c === void 0 ? void 0 : _c.claimedAt, mintAddress: merkleDistributors[index].mint, distributor: merkleDistributors[index], distributorATAPublicKey, claimId: claimAndBumps[index][0], claimStatusBump: claimAndBumps[index][1] });
            })));
            const mostRecentSlot = yield this.provider.connection.getSlot("finalized");
            const mostRecentSlotTime = (yield this.provider.connection.getBlockTime(mostRecentSlot));
            const rewards = fullData.reduce((acc, currentValue) => {
                if (!acc[currentValue.distributor.mint]) {
                    acc[currentValue.distributor.mint] = [];
                }
                acc[currentValue.distributor.mint].push(currentValue);
                return acc;
            }, {});
            const externalEarningsData = externalScoreData.reduce((acc, rewardScore) => {
                var _a, _b;
                const rewardStat = externalStatData.find((reward) => reward.reserveID === rewardScore.reserveID &&
                    reward.side === rewardScore.side);
                const currentScore = rewardStat
                    ? (0, utils_1.estimateCurrentScore)(rewardStat, rewardScore, mostRecentSlot, mostRecentSlotTime).toNumber()
                    : 0;
                return Object.assign(Object.assign({}, acc), { [rewardScore.rewardMint]: {
                        symbol: rewardScore.rewardSymbol,
                        lifetimeAmount: ((_b = (_a = acc[rewardScore.rewardMint]) === null || _a === void 0 ? void 0 : _a.lifetimeAmount) !== null && _b !== void 0 ? _b : 0) +
                            Number(currentScore),
                    } });
            }, {});
            const rewardsData = Object.assign({}, externalEarningsData);
            const rewardMetadata = (yield (yield axios_1.default.get(`${API_ENDPOINT}/tokens/?symbols=${Object.values(rewardsData)
                .map((rew) => rew.symbol)
                .join(",")}`)).data).results;
            this.rewards = Object.fromEntries(Object.entries(rewardsData).map(([rewardMint, earning]) => {
                var _a, _b, _c;
                const rewardData = rewards[rewardMint];
                const rewardClaims = fullData
                    .filter((lot) => lot.mintAddress.toBase58() === rewardMint)
                    .map((reward) => new claim_1.SolendClaim(reward, this.provider));
                const metadata = rewardMetadata.find((rew) => (rew === null || rew === void 0 ? void 0 : rew.symbol) === earning.symbol);
                return [
                    rewardMint,
                    Object.assign(Object.assign(Object.assign({}, earning), metadata), { lifetimeAmount: earning.lifetimeAmount / Math.pow(10, (36 - ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.decimals) !== null && _a !== void 0 ? _a : 0))), claimedAmount: (_b = rewardData === null || rewardData === void 0 ? void 0 : rewardData.filter((reward) => reward.claimedAt).reduce((acc, reward) => acc + Number(reward.quantity), 0)) !== null && _b !== void 0 ? _b : 0, claimableAmount: (_c = rewardData === null || rewardData === void 0 ? void 0 : rewardData.filter((reward) => !reward.claimedAt && reward.claimable).reduce((acc, reward) => acc + Number(reward.quantity), 0)) !== null && _c !== void 0 ? _c : 0, rewardClaims: rewardClaims }),
                ];
            }));
        });
    }
    getClaimAllIxs() {
        return __awaiter(this, void 0, void 0, function* () {
            const allSetupIxs = [];
            const allClaimIxs = [];
            for (const claim of Object.values(this.rewards).flatMap((reward) => reward.rewardClaims)) {
                const [setupIxs, claimIxs] = yield claim.getClaimIxs();
                allSetupIxs.push(...setupIxs);
                allClaimIxs.push(...claimIxs);
            }
            return [allSetupIxs, allClaimIxs];
        });
    }
}
exports.SolendWallet = SolendWallet;
