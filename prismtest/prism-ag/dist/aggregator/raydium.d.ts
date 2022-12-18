import { TokenInfo } from "../types/types";
import { TokenAmount } from "../utils/safeMath";
export declare function getSwapOutAmount(poolInfo: any, fromCoinMint: string, toCoinMint: string, amount: number, slippage: number): {
    amountIn: TokenAmount;
    amountOut: number;
    amountOutWithSlippage: number;
    priceImpact: number;
    afterPrice: number;
};
export declare function raydiumRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, liquidityProviders: any, settings: any): {
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
        poolInfo: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
