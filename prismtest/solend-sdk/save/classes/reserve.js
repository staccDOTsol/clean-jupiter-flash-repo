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
exports.SolendReserve = void 0;
// @ts-nocheck
/* eslint-disable max-classes-per-file */
const web3_js_1 = require("@solana/web3.js");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const reserve_1 = require("../state/reserve");
const bn_js_1 = __importDefault(require("bn.js"));
const constants_1 = require("./constants");
class SolendReserve {
    constructor(reserveConfig, connection) {
        this.calculateSupplyAPY = (reserve) => {
            const apr = this.calculateSupplyAPR(reserve);
            const apy = Math.pow(new bignumber_js_1.default(1)
                .plus(new bignumber_js_1.default(apr).dividedBy(constants_1.SLOTS_PER_YEAR))
                .toNumber(), constants_1.SLOTS_PER_YEAR) -
                1;
            return apy;
        };
        this.calculateBorrowAPY = (reserve) => {
            const apr = this.calculateBorrowAPR(reserve);
            const apy = Math.pow(new bignumber_js_1.default(1)
                .plus(new bignumber_js_1.default(apr).dividedBy(constants_1.SLOTS_PER_YEAR))
                .toNumber(), constants_1.SLOTS_PER_YEAR) -
                1;
            return apy;
        };
        this.config = reserveConfig;
        this.rewardsData = null;
        this.buffer = null;
        this.stats = null;
        this.connection = connection;
    }
    calculateSupplyAPR(reserve) {
        const currentUtilization = this.calculateUtilizationRatio(reserve);
        const borrowAPY = this.calculateBorrowAPR(reserve);
        return currentUtilization * borrowAPY;
    }
    calculateUtilizationRatio(reserve) {
        const totalBorrowsWads = new bignumber_js_1.default(reserve.liquidity.borrowedAmountWads.toString()).div(constants_1.WAD);
        const currentUtilization = totalBorrowsWads
            .dividedBy(totalBorrowsWads.plus(reserve.liquidity.availableAmount.toString()))
            .toNumber();
        return currentUtilization;
    }
    calculateBorrowAPR(reserve) {
        const currentUtilization = this.calculateUtilizationRatio(reserve);
        const optimalUtilization = reserve.optimalUtilizationRate / 100;
        let borrowAPR;
        if (optimalUtilization === 1.0 || currentUtilization < optimalUtilization) {
            const normalizedFactor = currentUtilization / optimalUtilization;
            const optimalBorrowRate = reserve.optimalBorrowRate / 100;
            const minBorrowRate = reserve.minBorrowRate / 100;
            borrowAPR =
                normalizedFactor * (optimalBorrowRate - minBorrowRate) + minBorrowRate;
        }
        else {
            const normalizedFactor = (currentUtilization - optimalUtilization) / (1 - optimalUtilization);
            const optimalBorrowRate = reserve.optimalBorrowRate / 100;
            const maxBorrowRate = reserve.maxBorrowRate / 100;
            borrowAPR =
                normalizedFactor * (maxBorrowRate - optimalBorrowRate) +
                    optimalBorrowRate;
        }
        return borrowAPR;
    }
    setBuffer(buffer) {
        this.buffer = buffer;
    }
    load(rewardsData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (rewardsData) {
                this.rewardsData = rewardsData;
            }
            if (!this.buffer) {
                this.buffer = yield this.connection.getAccountInfo(new web3_js_1.PublicKey(this.config.address), "processed");
            }
            if (!this.buffer) {
                throw Error(`Error requesting account info for ${this.config.liquidityToken.name}`);
            }
            const parsedData = (_a = (0, reserve_1.parseReserve)(new web3_js_1.PublicKey(this.config.address), this.buffer)) === null || _a === void 0 ? void 0 : _a.info;
            if (!parsedData) {
                throw Error(`Unable to parse data of reserve ${this.config.liquidityToken.name}`);
            }
            this.stats = this.formatReserveData(parsedData);
        });
    }
    calculateRewardAPY(rewardRate, poolSize, rewardPrice, tokenPrice, decimals) {
        const poolValueUSD = new bignumber_js_1.default(poolSize)
            .times(tokenPrice)
            .dividedBy("1".concat(Array(decimals + 1).join("0")))
            .dividedBy(constants_1.WAD);
        return new bignumber_js_1.default(rewardRate)
            .multipliedBy(rewardPrice)
            .dividedBy(poolValueUSD)
            .dividedBy(constants_1.WANG);
    }
    totalSupplyAPY() {
        const { stats } = this;
        if (!this.rewardsData || !stats) {
            throw Error("SolendMarket must call loadRewards.");
        }
        const rewards = this.rewardsData[this.config.liquidityToken.mint].supply.map((reward) => ({
            rewardMint: reward.rewardMint,
            rewardSymbol: reward.rewardSymbol,
            apy: this.calculateRewardAPY(reward.rewardRate, stats.totalDepositsWads.toString(), reward.price, stats.assetPriceUSD, this.config.liquidityToken.decimals).toNumber(),
            price: reward.price,
        }));
        const totalAPY = new bignumber_js_1.default(stats.supplyInterestAPY)
            .plus(rewards.reduce((acc, reward) => acc.plus(reward.apy), new bignumber_js_1.default(0)))
            .toNumber();
        return {
            interestAPY: stats.supplyInterestAPY,
            totalAPY,
            rewards,
        };
    }
    totalBorrowAPY() {
        const { stats } = this;
        if (!this.rewardsData || !stats) {
            throw Error("SolendMarket must call loadRewards.");
        }
        const rewards = this.rewardsData[this.config.liquidityToken.mint].borrow.map((reward) => ({
            rewardMint: reward.rewardMint,
            rewardSymbol: reward.rewardSymbol,
            apy: this.calculateRewardAPY(reward.rewardRate, stats.totalBorrowsWads.toString(), reward.price, stats.assetPriceUSD, this.config.liquidityToken.decimals).toNumber(),
            price: reward.price,
        }));
        const totalAPY = new bignumber_js_1.default(stats.borrowInterestAPY)
            .minus(rewards.reduce((acc, reward) => acc.plus(reward.apy), new bignumber_js_1.default(0)))
            .toNumber();
        return {
            interestAPY: stats.borrowInterestAPY,
            totalAPY,
            rewards,
        };
    }
    formatReserveData(parsedData) {
        const totalBorrowsWads = parsedData.liquidity.borrowedAmountWads;
        const totalLiquidityWads = parsedData.liquidity.availableAmount.mul(new bn_js_1.default(constants_1.WAD));
        const totalDepositsWads = totalBorrowsWads.add(totalLiquidityWads);
        const cTokenExchangeRate = new bignumber_js_1.default(totalDepositsWads.toString())
            .div(parsedData.collateral.mintTotalSupply.toString())
            .div(constants_1.WAD)
            .toNumber();
        return {
            // Reserve config
            optimalUtilizationRate: parsedData.config.optimalUtilizationRate / 100,
            loanToValueRatio: parsedData.config.loanToValueRatio / 100,
            liquidationBonus: parsedData.config.liquidationBonus / 100,
            liquidationThreshold: parsedData.config.liquidationThreshold / 100,
            minBorrowRate: parsedData.config.minBorrowRate / 100,
            optimalBorrowRate: parsedData.config.optimalBorrowRate / 100,
            maxBorrowRate: parsedData.config.maxBorrowRate / 100,
            protocolTakeRate: parsedData.config.protocolTakeRate / 100,
            borrowFeePercentage: new bignumber_js_1.default(parsedData.config.fees.borrowFeeWad.toString())
                .dividedBy(constants_1.WAD)
                .toNumber(),
            hostFeePercentage: parsedData.config.fees.hostFeePercentage / 100,
            flashLoanFeePercentage: new bignumber_js_1.default(parsedData.config.fees.flashLoanFeeWad.toString())
                .dividedBy(constants_1.WAD)
                .toNumber(),
            depositLimit: parsedData.config.depositLimit,
            reserveBorrowLimit: parsedData.config.borrowLimit,
            // Reserve info
            name: this.config.liquidityToken.name,
            symbol: this.config.liquidityToken.symbol,
            decimals: this.config.liquidityToken.decimals,
            mintAddress: this.config.liquidityToken.mint,
            totalDepositsWads,
            totalBorrowsWads,
            totalLiquidityWads,
            supplyInterestAPY: this.calculateSupplyAPY(parsedData),
            borrowInterestAPY: this.calculateBorrowAPY(parsedData),
            assetPriceUSD: new bignumber_js_1.default(parsedData.liquidity.marketPrice.toString())
                .div(constants_1.WAD)
                .toNumber(),
            userDepositLimit: this.config.userSupplyCap,
            cumulativeBorrowRateWads: parsedData.liquidity.cumulativeBorrowRateWads,
            cTokenExchangeRate,
        };
    }
}
exports.SolendReserve = SolendReserve;
