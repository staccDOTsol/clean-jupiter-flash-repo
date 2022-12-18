import { Connection } from "@solana/web3.js";
import { TokenInfo } from "../../types/types";
export declare function possibleRoutes(fromCoin: TokenInfo, toCoin: TokenInfo, LI: any, tokenMap: any, direct: boolean): {
    routes: any;
    toLoad: any;
};
export declare function loadLiquidityInfos(fromCoin: TokenInfo, toCoin: TokenInfo,  LI: any, connection: Connection, tokenMap: any, direct: boolean, reverse: boolean): Promise<any>;
