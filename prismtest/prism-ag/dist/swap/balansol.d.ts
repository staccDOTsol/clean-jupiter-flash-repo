import { Program, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrismAg } from "./idl";
export declare function balansolSwap(user: PublicKey, program: Program<PrismAg>, route: any, fromTokenAccount: PublicKey, toTokenAccount: PublicKey, fees: any, hostFees: number, useT?: any, disableFees?: any): Promise<web3.TransactionInstruction>;
