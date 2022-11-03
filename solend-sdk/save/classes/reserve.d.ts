/// <reference types="node" />
import { AccountInfo, Connection } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { ReserveConfigType, RewardsDataType, ReserveDataType } from "./shared";
export declare class SolendReserve {
    config: ReserveConfigType;
    private rewardsData;
    private buffer;
    stats: ReserveDataType | null;
    private connection;
    constructor(reserveConfig: ReserveConfigType, connection: Connection);
    private calculateSupplyAPY;
    private calculateBorrowAPY;
    private calculateSupplyAPR;
    private calculateUtilizationRatio;
    private calculateBorrowAPR;
    setBuffer(buffer: AccountInfo<Buffer> | null): void;
    load(rewardsData?: RewardsDataType): Promise<void>;
    calculateRewardAPY(rewardRate: string, poolSize: string, rewardPrice: number, tokenPrice: number, decimals: number): BigNumber;
    totalSupplyAPY(): {
        interestAPY: number;
        totalAPY: number;
        rewards: {
            rewardMint: string | undefined;
            rewardSymbol: string;
            apy: number;
            price: number;
        }[];
    };
    totalBorrowAPY(): {
        interestAPY: number;
        totalAPY: number;
        rewards: {
            rewardMint: string | undefined;
            rewardSymbol: string;
            apy: number;
            price: number;
        }[];
    };
    private formatReserveData;
}
