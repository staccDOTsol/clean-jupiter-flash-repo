"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateCurrentScore = exports.calculateNewScore = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const SLOT_RATE = 2;
const DAILY_SLOTS = 24 * 60 * 60 * SLOT_RATE;
const ANNUAL_SLOTS = 365 * DAILY_SLOTS * SLOT_RATE;
function getLatestRewardRate(rewardRates, slot) {
    return rewardRates
        .filter((rr) => slot >= rr.beginningSlot)
        .reduce((v1, v2) => (v1.beginningSlot > v2.beginningSlot ? v1 : v2), {
        beginningSlot: 0,
        rewardRate: "0",
    });
}
const calculateNewScore = (rewardStat, pool, rewardRate, endSlot, startSlot) => {
    const { balance, debt, score } = pool;
    const { rewardsPerShare, totalBalance } = rewardStat;
    const oldDebt = new bignumber_js_1.default(debt);
    const oldScore = new bignumber_js_1.default(score);
    const oldRewardsPerShare = new bignumber_js_1.default(rewardsPerShare);
    const oldBalance = new bignumber_js_1.default(balance);
    const totalBalanceVal = new bignumber_js_1.default(totalBalance);
    const newRewardsPerShare = !totalBalanceVal.isZero()
        ? oldRewardsPerShare.plus(new bignumber_js_1.default(endSlot)
            .minus(new bignumber_js_1.default(startSlot.toString()))
            .times(new bignumber_js_1.default(rewardRate))
            .div(totalBalanceVal)
            .div(new bignumber_js_1.default(ANNUAL_SLOTS)))
        : new bignumber_js_1.default(0);
    return oldScore.plus(newRewardsPerShare.times(oldBalance).minus(oldDebt));
};
exports.calculateNewScore = calculateNewScore;
const estimateCurrentScore = (rewardStat, rewardScore, mostRecentSlot, mostRecentSlotTime) => {
    const { lastSlot, rewardRates } = rewardStat;
    const estimatedCurrentSlot = mostRecentSlot + SLOT_RATE * (Date.now() / 1000 - mostRecentSlotTime);
    const { rewardRate } = getLatestRewardRate(rewardRates, estimatedCurrentSlot);
    const currentScore = (0, exports.calculateNewScore)(rewardStat, rewardScore, rewardRate, estimatedCurrentSlot, lastSlot);
    return currentScore;
};
exports.estimateCurrentScore = estimateCurrentScore;
