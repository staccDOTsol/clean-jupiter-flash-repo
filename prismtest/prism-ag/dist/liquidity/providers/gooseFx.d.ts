/// <reference types="node" />
/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
export declare const ORACLE_ELEMENT_LAYOUT: any;
export declare const ORACLE_LAYOUT: any;
export declare const PAIR_LAYOUT: any;
export declare function getGooseFxCacheData(connection: Connection): Promise<{
    programAccounts: {
        publicKey: PublicKey;
        accountInfo: import("@solana/web3.js").AccountInfo<Buffer>;
    }[];
    pairDatasParsed: any;
    wasm: typeof import("goosefx-ssl-sdk-prism/dist/wasm/gfx_ssl_wasm");
} | {
    programAccounts?: undefined;
    pairDatasParsed?: undefined;
    wasm?: undefined;
}>;
export declare function getGooseFxPools(connection: Connection, data: any): any;
