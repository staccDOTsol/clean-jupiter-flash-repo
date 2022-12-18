import { TokenInfo } from "../types/types";
export declare function forecastBuy(market: any, orderBook: any, pcIn: any, slippage: number): {
    side: "buy" | "sell";
    maxInAllow: number;
    maxInAmount: any;
    maxOutAmount: number;
    amountOut: number;
    amountOutWithSlippage: number;
    worstPrice: number;
    priceImpact: number;
};
export declare function forecastSell(market: any, orderBook: any, coinIn: any, slippage: number): {
    side: "buy" | "sell";
    maxInAllow: number;
    maxInAmount: any;
    maxOutAmount: number;
    amountOut: number;
    amountOutWithSlippage: number;
    worstPrice: number;
    priceImpact: number;
};
export declare function getOutAmount(market: any, asks: any, bids: any, fromCoinMint: string, toCoinMint: string, fromAmount: number, slippage: number): {
    side: "buy" | "sell";
    maxInAllow: number;
    maxInAmount: any;
    maxOutAmount: number;
    amountOut: number;
    amountOutWithSlippage: number;
    worstPrice: number;
    priceImpact: number;
};
export declare function openbookRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
    from: string;
    amountIn: number;
    maxInAmount: any;
    maxOutAmount: number;
    to: string;
    amountOut: number;
    amountWithFees: number;
    minimumReceived: number;
    provider: string;
    fees: any;
    priceImpact: number;
    routeData: {
        marketConfig: any;
        side: "buy" | "sell";
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
};
