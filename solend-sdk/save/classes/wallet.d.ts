import { Connection, PublicKey } from "@solana/web3.js";
import { SolendClaim } from "./claim";
import * as anchor from "@project-serum/anchor";
import { OptionMarketWithKey } from "@mithraic-labs/psy-american";
import { ConfigType } from "./shared";
export declare type ClaimType = {
    obligationID: string;
    lotNumber: number;
    index: number;
    quantity: string;
    root: string;
    proof: Array<string>;
    distributorPublicKey: string;
    name: string;
    incentivizer: string;
    optionMarketKey: string;
};
export declare type EnrichedClaimType = {
    claimable: boolean;
    claimedAt: number | null;
    mintAddress: string;
    quantity: string;
    distributor: {
        mint: PublicKey;
        bump: number;
    };
    distributorATAPublicKey: PublicKey;
    claimId: PublicKey;
    claimStatusBump: number;
    optionMarket: (OptionMarketWithKey & {
        userBalance: number;
    }) | null;
} & ClaimType;
export declare type SolendReward = {
    lifetimeAmount: number;
    symbol: string;
    claimedAmount: number;
    claimableAmount: number;
    rewardClaims: Array<SolendClaim>;
};
export declare class SolendWallet {
    config: ConfigType | null;
    rewards: {
        [key: string]: SolendReward;
    };
    provider: anchor.AnchorProvider;
    programId: PublicKey;
    private constructor();
    static initialize(wallet: anchor.Wallet, connection: Connection, environment?: "production" | "devnet"): Promise<SolendWallet>;
    loadRewards(): Promise<void>;
    getClaimAllIxs(): Promise<anchor.web3.TransactionInstruction[][]>;
}
