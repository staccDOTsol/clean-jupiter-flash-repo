import { Connection } from "@solana/web3.js";
import { LiqProviders } from "../../types/types";
export declare function getCacheData(connection: Connection, disableCache?: boolean): Promise<any>;
export declare function loadLiquidityProviders(connection: Connection, liqProviders: LiqProviders, disableCache?: boolean): Promise<any>;
