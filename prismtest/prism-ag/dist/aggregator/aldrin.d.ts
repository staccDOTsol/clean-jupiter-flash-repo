import { TokenInfo } from "../types/types";
export declare function aldrinRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
    amountOut: number;
    from?: undefined;
    amountIn?: undefined;
    to?: undefined;
    minimumReceived?: undefined;
    provider?: undefined;
    fees?: undefined;
    priceImpact?: undefined;
    routeData?: undefined;
    amountWithFees?: undefined;
} | {
    from: string;
    amountIn: number;
    to: string;
    amountOut: number;
    minimumReceived: number;
    provider: string;
    fees: any;
    priceImpact: number;
    routeData: {
        aldrinInfo: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
    amountWithFees?: undefined;
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
        aldrinInfo: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
