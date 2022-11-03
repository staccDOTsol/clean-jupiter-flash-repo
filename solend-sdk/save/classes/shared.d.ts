import BN from "bn.js";
export declare type RewardInfoType = {
    rewardRate: string;
    rewardMint?: string;
    rewardSymbol: string;
    price: number;
};
export declare type RewardsDataType = {
    [key: string]: {
        supply: Array<RewardInfoType>;
        borrow: Array<RewardInfoType>;
    };
};
export declare type RewardResponseType = {
    supply: RewardStatType;
    borrow: RewardStatType;
};
export declare type RewardStatType = {
    rewardsPerShare: string;
    totalBalance: string;
    lastSlot: number;
    rewardRates: Array<{
        beginningSlot: number;
        rewardRate: string;
        name?: string;
    }>;
} | null;
export declare type ExternalRewardStatType = RewardStatType & {
    rewardMint: string;
    rewardSymbol: string;
    reserveID: string;
    side: "supply" | "borrow";
};
export declare type ConfigType = Array<MarketConfigType>;
export declare type ReserveConfigType = {
    liquidityToken: {
        coingeckoID: string;
        decimals: number;
        logo: string;
        mint: string;
        name: string;
        symbol: string;
        volume24h: number;
    };
    pythOracle: string;
    switchboardOracle: string;
    address: string;
    collateralMintAddress: string;
    collateralSupplyAddress: string;
    liquidityAddress: string;
    liquidityFeeReceiverAddress: string;
    userSupplyCap: number;
    userBorrowCap: number;
};
export declare type MarketConfigType = {
    name: string;
    isPrimary: boolean;
    description: string;
    creator: string;
    address: string;
    hidden: boolean;
    authorityAddress: string;
    reserves: Array<ReserveConfigType>;
};
export declare type ReserveDataType = {
    optimalUtilizationRate: number;
    loanToValueRatio: number;
    liquidationBonus: number;
    liquidationThreshold: number;
    minBorrowRate: number;
    optimalBorrowRate: number;
    maxBorrowRate: number;
    borrowFeePercentage: number;
    flashLoanFeePercentage: number;
    hostFeePercentage: number;
    depositLimit: BN;
    reserveBorrowLimit: BN;
    name: string;
    symbol: string;
    decimals: number;
    mintAddress: string;
    totalDepositsWads: BN;
    totalBorrowsWads: BN;
    totalLiquidityWads: BN;
    supplyInterestAPY: number;
    borrowInterestAPY: number;
    assetPriceUSD: number;
    protocolTakeRate: number;
    userDepositLimit?: number;
    cumulativeBorrowRateWads: BN;
    cTokenExchangeRate: number;
};
