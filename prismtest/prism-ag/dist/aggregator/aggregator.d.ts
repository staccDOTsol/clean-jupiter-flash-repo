import { TokenInfo } from "../types/types";
export declare function findDirectRoute(fromCoin: TokenInfo, toCoin: TokenInfo, amount: number, option: any, liquidityData: any, liquidityProviders: any, settings: any): any;
export declare function directRoute(route: any): any;
export declare function splitRoute(route1: any, route2: any, split: number): {
    type: string;
    from: any;
    amountIn: any;
    to: any;
    amountOut: any;
    amountWithFees: any;
    minimumReceived: any;
    providers: any[];
    fees: {
        [x: number]: any;
    };
    priceImpact: number;
    priceDisplay: number;
    split: number[];
    routeData: {
        route1: any;
        route2: any;
        fromCoin: any;
        toCoin: any;
    };
};
export declare function transitiveRoute(routeFrom: any, routeTo: any): {
    type: string;
    from: any;
    amountIn: any;
    mid: any;
    amountMid: any;
    to: any;
    amountOut: any;
    amountWithFees: any;
    minimumReceived: any;
    providers: any[];
    fees: any;
    priceImpact: number;
    priceDisplay: number;
    split: number[];
    routeData: {
        route1: any;
        route2: any;
        fromCoin: any;
        midCoin: any;
        toCoin: any;
    };
};
export declare function findRoutes(fromCoin: TokenInfo, toCoin: TokenInfo, amount: number, liquidityInfos: any, liquidityProviders: any, settings: any): any;
