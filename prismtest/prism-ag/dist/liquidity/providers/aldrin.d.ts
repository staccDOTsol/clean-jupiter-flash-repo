import * as aldrinSDK from "@aldrin_exchange/sdk";
import { Connection } from "@solana/web3.js";
export declare function getAldrinCacheData(connection: Connection): Promise<{
    poolsInit: aldrinSDK.PoolRpcResponse[];
    v2Pools: aldrinSDK.PoolRpcV2Response[];
} | {
    poolsInit?: undefined;
    v2Pools?: undefined;
}>;
export declare function getAldrinPools(connection: Connection, data: any): any;
