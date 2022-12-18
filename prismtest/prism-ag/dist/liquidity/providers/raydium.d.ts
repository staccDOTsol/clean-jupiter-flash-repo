/// <reference types="node" />
/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Connection, PublicKey } from "@solana/web3.js";
export declare function getRaydiumCacheData(connection: Connection): Promise<{
    ammInfos: {
        publicKey: PublicKey;
        accountInfo: import("@solana/web3.js").AccountInfo<Buffer>;
    }[];
} | {
    ammInfos?: undefined;
}>;
export declare function getRaydiumAmms(data: any): any;
