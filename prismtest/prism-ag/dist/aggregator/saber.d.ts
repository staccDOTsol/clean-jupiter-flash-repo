import { TokenInfo } from "../types/types";
export declare function saberRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
    amountOut: number;
    from?: undefined;
    amountIn?: undefined;
    to?: undefined;
    amountWithFees?: undefined;
    minimumReceived?: undefined;
    provider?: undefined;
    fees?: undefined;
    priceImpact?: undefined;
    routeData?: undefined;
} | {
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
        saberInfo: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
