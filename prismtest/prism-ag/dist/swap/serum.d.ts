/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Program } from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { PrismAg } from "./idl";
export declare function serumSwap(user: PublicKey, connection: Connection, settings: any, program: Program<PrismAg>, route: any, fromTokenAccount: PublicKey, toTokenAccount: PublicKey, fees: any, preTransaction: Transaction, preSigners: Array<any>, hostFees: number, userOpenOrders: any, useT?: any, disableFees?: any): Promise<import("@solana/web3.js").TransactionInstruction>;
