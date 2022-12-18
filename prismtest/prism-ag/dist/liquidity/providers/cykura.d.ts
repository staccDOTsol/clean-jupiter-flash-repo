/// <reference types="bn.js" />
import { Connection, PublicKey } from "@solana/web3.js";
import { CyclosCore, PoolVars } from "@cykura/sdk";
import JSBI from "jsbi";
import * as anchor from "@project-serum/anchor";
export declare function getCykuraPools(connection: Connection): Promise<any>;
export declare class SolanaTickDataProvider {
    program: anchor.Program<CyclosCore>;
    pool: PoolVars;
    bitmapCache: Map<number, {
        address: PublicKey;
        word: anchor.BN;
    } | undefined>;
    tickCache: Map<number, {
        address: PublicKey;
        liquidityNet: JSBI;
    } | undefined>;
    constructor(program: anchor.Program<CyclosCore>, pool: PoolVars);
    /**
     * Caches ticks and bitmap accounts near the current price
     * @param tickCurrent The current pool tick
     * @param tickSpacing The pool tick spacing
     */
    eagerLoadCache(tickCurrent: number, tickSpacing: number): Promise<void>;
    getTickAddressSync(tick: number): anchor.web3.PublicKey;
    getBitmapAddressSync(wordPos: number): anchor.web3.PublicKey;
    getTick(tick: number): {
        address: anchor.web3.PublicKey;
        liquidityNet: JSBI;
    };
    /**
     * Fetches the cached bitmap for the word
     * @param wordPos
     */
    getBitmap(wordPos: number): {
        address: anchor.web3.PublicKey;
        word: anchor.BN;
    };
    /**
     * Finds the next initialized tick in the given word. Fetched bitmaps are saved in a
     * cache for quicker lookups in future.
     * @param tick The current tick
     * @param lte Whether to look for a tick less than or equal to the current one, or a tick greater than or equal to
     * @param tickSpacing The tick spacing for the pool
     * @returns
     */
    nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): [number, boolean, number, number, PublicKey];
}
