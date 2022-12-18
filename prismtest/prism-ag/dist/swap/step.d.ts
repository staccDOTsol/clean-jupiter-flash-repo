/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { PrismAg } from "./idl";
export declare function stepSwap(user: PublicKey, program: Program<PrismAg>, route: any, fromTokenAccount: PublicKey, toTokenAccount: PublicKey, fees: any, hostFees: number, useT?: any, disableFees?: any): Promise<import("@solana/web3.js").TransactionInstruction>;
