import { TokenInfo } from "../types/types";
import { TokenSwap } from "@cremafinance/crema-sdk";
export declare function cremaRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
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
        cremaInfo: TokenSwap;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
