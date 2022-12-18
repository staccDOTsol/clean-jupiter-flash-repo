/// <reference types="node" />
/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Connection } from "@solana/web3.js";
export declare function getSymmetryCacheData(connection: Connection): Promise<{
    accountInfos: {
        tokenInfoAccountInfo: import("@solana/web3.js").AccountInfo<Buffer>;
        curveDataAccountInfo: import("@solana/web3.js").AccountInfo<Buffer>;
        pythDataAccountInfos: import("@solana/web3.js").AccountInfo<Buffer>[];
        fundStateAccountInfos: {
            pubkey: import("@solana/web3.js").PublicKey;
            account: import("@solana/web3.js").AccountInfo<Buffer>;
        }[];
    };
    tokenList: {
        tokenId: number;
        coingeckoId: string;
        tokenMint: string;
    }[];
} | {
    accountInfos?: undefined;
    tokenList?: undefined;
}>;
export declare function getSymmetryFunds(data: any): any;
