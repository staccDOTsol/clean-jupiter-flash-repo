import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { TokenInfo, TokenList } from "../types/types";
import { Wallet } from "@project-serum/anchor";
export declare function createAmmAuthority(programId: PublicKey): PublicKey;
export declare function getBigNumber(num: any): number;
export declare function coinInfo(coinInfo: any): TokenInfo;
export declare function findCoinFrom(tokenList: Array<any>, symbolOrMint: string): any;
export declare function fetchUserOpenOrders(tokenList: TokenList, connection: Connection, publicKey: PublicKey, program: PublicKey): Promise<any>;
export declare function sendCustomTransaction(connection: Connection, wallet: Wallet, allInstructions: Array<Array<TransactionInstruction>>): Promise<any[]>;
export declare function closeOpenOrdersForUser(prism: any, openOrders: Array<any>): Promise<any[]>;
export declare function unwrapWSolAccounts(prism: any): Promise<any[]>;
export declare function fetchUserAccounts(tokenList: TokenList, connection: Connection, publicKey: PublicKey): Promise<any>;
export declare function fetchUserAccountsAndTokenList(tokenList: TokenList, connection: Connection, publicKey: PublicKey): Promise<{
    accounts: any;
    tokenList: TokenList;
}>;
export declare function unKnownSerumMarket(mintA: string, mintB: string, knownPairs: any, option: any): boolean;
export declare function getUserHistoty(pubkey: PublicKey): Promise<any>;
export declare const getGlobalStats: () => Promise<any>;
