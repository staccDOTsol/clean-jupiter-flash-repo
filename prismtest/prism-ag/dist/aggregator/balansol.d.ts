import { TokenInfo } from "../types/types";
export declare function balansolRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
    from: string;
    amountIn: number;
    to: string;
    amountOut: number;
    amountWithFees: number;
    minimumReceived: number;
    provider: string;
    fees: number;
    priceImpact: number;
    routeData: {
        balansolInfo: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
