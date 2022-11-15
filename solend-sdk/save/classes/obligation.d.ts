import { PublicKey } from "@solana/web3.js";
import { SolendReserve } from "./reserve";
import { Obligation } from "../state/obligation";
import BN from "bn.js";
export declare type Position = {
    mintAddress: string;
    amount: BN;
};
export declare type ObligationStats = {
    liquidationThreshold: number;
    userTotalDeposit: number;
    userTotalBorrow: number;
    borrowLimit: number;
    borrowUtilization: number;
    netAccountValue: number;
    positions: number;
};
export declare class SolendObligation {
    walletAddress: PublicKey;
    obligationAddress: PublicKey;
    deposits: Array<Position>;
    borrows: Array<Position>;
    obligationStats: ObligationStats;
    constructor(walletAddress: PublicKey, obligationAddress: PublicKey, obligation: Obligation, reserves: Array<SolendReserve>);
    private calculatePositions;
}
