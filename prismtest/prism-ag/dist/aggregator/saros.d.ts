import { TokenInfo } from "../types/types";
export declare function sarosRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
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
        sarosPool: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
