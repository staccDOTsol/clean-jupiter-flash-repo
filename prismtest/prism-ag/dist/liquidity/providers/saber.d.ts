import { Connection } from "@solana/web3.js";
export declare function getSaberCacheData(connection: Connection): Promise<{
    swaps: any;
    result: any;
} | {
    swaps?: undefined;
    result?: undefined;
}>;
export declare function getSaberPools(data: any): any;
