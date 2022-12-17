import BigNumber from "bignumber.js";
declare type ObligationFarmScoreType = {
    obligationId: string;
    balance: string;
    debt: string;
    score: string;
    lastSlot: number;
    tokenMint: string;
    side: "supply" | "borrow";
};
declare type RewardRate = {
    beginningSlot: number;
    rewardRate: string;
    name?: string;
};
export declare const calculateNewScore: (rewardStat: {
    lastSlot: number;
    rewardRates: Array<RewardRate>;
    rewardsPerShare: string;
    totalBalance: string;
}, pool: ObligationFarmScoreType, rewardRate: string, endSlot: number, startSlot: number) => BigNumber;
export declare const estimateCurrentScore: (rewardStat: {
    lastSlot: number;
    rewardRates: Array<RewardRate>;
    rewardsPerShare: string;
    totalBalance: string;
}, rewardScore: ObligationFarmScoreType, mostRecentSlot: number, mostRecentSlotTime: number) => BigNumber;
export {};
