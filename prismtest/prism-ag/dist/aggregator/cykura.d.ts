/// <reference types="@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { TokenInfo } from "../types/types";
import BN from "bn.js";
export declare function cykuraRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
    from: string;
    amountIn: number;
    to: string;
    amountOut: number;
    amountWithFees: number;
    minimumReceived: number;
    provider: string;
    fees: any;
    priceImpact: number;
    routeData: {
        cykuraPool: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
        inputVault: any;
        outputVault: any;
        remainingAccounts: import("@solana/web3.js").AccountMeta[];
        sqrtPriceLimit: BN;
    };
} | null;
