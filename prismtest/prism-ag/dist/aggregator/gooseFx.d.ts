import { TokenInfo } from "../types/types";
export declare function gooseFxRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
    from: string;
    amountIn: number;
    to: string;
    amountOut: number;
    amountWithFees: number;
    minimumReceived: number;
    provider: string;
    fees: any;
    priceImpact: any;
    routeData: {
        gooseFxPool: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
