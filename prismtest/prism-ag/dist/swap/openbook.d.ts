import { Program } from "@project-serum/anchor";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { PrismAg } from "./idl";
export declare function openbookSwap(user: PublicKey, connection: Connection, settings: any, program: Program<PrismAg>, route: any, fromTokenAccount: PublicKey, toTokenAccount: PublicKey, fees: any, preTransaction: Transaction, preSigners: Array<any>, hostFees: number, userOpenOrders: any, useT?: any, disableFees?: any): Promise<TransactionInstruction>;
