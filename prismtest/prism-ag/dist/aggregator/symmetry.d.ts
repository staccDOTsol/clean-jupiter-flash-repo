import { TokenInfo } from "../types/types";
export declare function symmetryRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
    from: string;
    amountIn: number;
    to: string;
    amountOut: any;
    amountWithFees: number;
    minimumReceived: number;
    provider: string;
    fees: any;
    priceImpact: number;
    routeData: {
        symmetryInfo: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
