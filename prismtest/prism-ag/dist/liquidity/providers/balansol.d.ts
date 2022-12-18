/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Connection } from "@solana/web3.js";
export declare function getBalansolCacheData(connection: Connection): Promise<{
    markets: {
        owner: string;
        pubkey: any;
        data: any;
        params: {
            treasurer: import("@solana/web3.js").PublicKey;
            taxmanTokenAccounts: import("@solana/web3.js").PublicKey[];
        };
    }[];
} | {
    markets?: undefined;
}>;
export declare function getBalansolPools(data: any): any;
