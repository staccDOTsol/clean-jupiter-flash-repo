import { StableSwap } from "@saberhq/stableswap-sdk";
import { PublicKey } from "@solana/web3.js";
export declare function loadSingle(stableSwap: StableSwap, reserveA: any, reserveB: any): {
    stableSwap?: undefined;
    reserveA?: undefined;
    reserveB?: undefined;
    exchange?: undefined;
    exchangeInfo?: undefined;
} | {
    stableSwap: StableSwap;
    reserveA: any;
    reserveB: any;
    exchange: import("@saberhq/stableswap-sdk").IExchange;
    exchangeInfo: import("@saberhq/stableswap-sdk").IExchangeInfo;
};
export declare function findSwapAuthorityKey(swapAccount: PublicKey): PublicKey;
export declare function _loadSaber(liquidity: any): any;
export declare function loadSaber(liquidity: any, results: any[]): any;
