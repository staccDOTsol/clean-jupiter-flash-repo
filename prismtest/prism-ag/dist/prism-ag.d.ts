/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { LiqProviders, PrismLoadParams, TokenList } from "./types/types";
import { Wallet } from "./types/types";
export declare class Prism {
    private settings;
    private user;
    private publicKey;
    private liquidityInfos;
    private userAccounts;
    private userOpenOrdersSerum;
    private userOpenOrdersOpenBook;
    private connection;
    private tokenList;
    private liquidityProviders;
    private lastFromCoin;
    private lastToCoin;
    private fromCoin;
    private toCoin;
    constructor(connection: Connection, user: Keypair | Wallet | PublicKey | undefined, publicKey: PublicKey, settings: any, userAccounts: Array<any>, tokenList: TokenList, liquidityProviders: any);
    static init(params: PrismLoadParams, disableCache?: boolean): Promise<Prism>;
    static getCacheData(connection: Connection): Promise<any>;
    setSigner(user: Keypair | Wallet): Promise<void>;
    setSlippage(slippage: number): void;
    setLiqProviders(liqProviders: LiqProviders): void;
    getUserAccounts(): any[];
    getUserOpenOrdersSerum(): any;
    getUserOpenOrdersOpenbook(): any;
    closeOpenOrders(openOrders: Array<any>): Promise<null>;
    unwrapWSolAccounts(): Promise<null>;
    static loadPrismStats(): Promise<any>;
    loadPrismStats(): Promise<any>;
    static loadUserTradeHistory(publicKey: PublicKey): Promise<any>;
    loadUserTradeHistory(): Promise<any>;
    loadRoutes(from: string, to: string, direct?: boolean): Promise<any>;
    getRoutes(amount: number): any;
    generateSwapTransactions(route: any): Promise<{
        preTransaction: any;
        preSigners: any;
        mainTransaction: any;
        postTransaction: any;
    }>;
    generateSymmetryTransaction(route: any, fromTokenAccount: any, toTokenAccount: any): Promise<{
        transaction: import("@solana/web3.js").Transaction;
        signers: any[];
        mainSigners: any[];
    }>;
    swap(route: any): Promise<any>;
    /**
    * @deprecated Swap function already confirms transaction
    */
    confirmSwap(result: any): Promise<any>;
}
