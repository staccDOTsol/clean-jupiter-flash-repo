import * as anchor from "@project-serum/anchor";
import { EnrichedClaimType } from "./wallet";
export declare class SolendClaim {
    metadata: EnrichedClaimType;
    provider: anchor.AnchorProvider;
    constructor(metadata: EnrichedClaimType, provider: anchor.AnchorProvider);
    getExerciseIxs(amount: number): Promise<any[][]>;
    getClaimIxs(): Promise<anchor.web3.TransactionInstruction[][]>;
    claim(): Promise<string>;
}
