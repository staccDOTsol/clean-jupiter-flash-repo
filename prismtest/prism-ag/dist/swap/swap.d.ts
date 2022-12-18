/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
export declare function singleRoute(user: PublicKey, connection: Connection, settings: any, route: any, fromAcc: PublicKey, toAcc: PublicKey, fees: any, preTransaction: Transaction, postTransaction: Transaction, mainSigners: Array<any>, preSigners: Array<any>, openOrdersSerum: any, openOrdersOpenBook: any, useT?: any, disableFees?: any): Promise<import("@solana/web3.js").TransactionInstruction | undefined>;
export declare function generateSymmetryTransaction(prism: any, route: any, fromTokenAccount: any, toTokenAccount: any): Promise<{
    transaction: Transaction;
    signers: Array<any>;
    mainSigners: Array<any>;
}>;
export declare function generateTransactions(prism: any, route: any): Promise<{
    preTransaction: Transaction;
    preSigners: any;
    mainSigners: Keypair[];
    mainTransaction: Transaction;
    postTransaction: Transaction;
    fromTokenAccount: any;
    midTokenAccount: any;
    toTokenAccount: any;
    toFees: {
        owner: PublicKey;
        host: PublicKey;
    } | null;
    midFees: {
        owner: PublicKey;
        host: PublicKey;
    } | null;
}>;
export declare function sendAndConfirmTransaction(connection: Connection, serialized: any): Promise<{
    signature: any;
    response: any;
}>;
export declare function executeSwap(prism: any, route: any): Promise<any>;
