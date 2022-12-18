import BN from "bn.js";
import { TokenInfo } from "../types/types";
export declare function marinadeRoute(fromCoin: TokenInfo, toCoin: TokenInfo, fromCoinAmount: number, option: any, liquidityData: any, settings: any): {
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
        marinadePool: any;
        fromCoin: TokenInfo;
        toCoin: TokenInfo;
    };
} | null;
export declare function getDepositQuote(state: any, amount: BN, liqPoolMsolLegAmount: BN): BN;
export declare function getUnstakeQuote(state: any, amount: BN, liqPoolSolLegPdaAmount: BN): BN;
export declare function linearFee(state: any, lamports: BN): BN;
export declare function calcMsolFromLamports(state: any, stakeLamports: BN): BN;
export declare function calcLamportsFromMsolAmount(state: any, msolAmount: BN): BN;
export declare function totalVirtualStakedLamports(state: any): BN;
export declare function totalLamportsUnderControl(state: any): BN;
export declare function totalCoolingDown(state: any): BN;
export declare function valueFromShares(shares: BN, totalValue: BN, totalShares: BN): BN;
export declare function sharesFromValue(value: BN, totalValue: BN, totalShares: BN): BN;
export declare function proportional(amount: BN, numerator: BN, denominator: BN): BN;
