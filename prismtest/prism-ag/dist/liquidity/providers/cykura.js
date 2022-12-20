"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaTickDataProvider = exports.getCykuraPools = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const common_1 = require("./common");
const types_1 = require("../../types/types");
const anchor_1 = require("@project-serum/anchor");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
const sdk_1 = require("@cykura/sdk");
const jsbi_1 = __importDefault(require("jsbi"));
const anchor = __importStar(require("@project-serum/anchor"));
const bn_js_1 = require("bn.js");
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
function getCykuraPools(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        let programAccounts = yield (0, common_1.getFilteredProgramAccounts)(connection, new web3_js_1.PublicKey(types_1.CYKURA_PROGRAM_ID), [{ dataSize: 138 }]);
        let decodedAccounts = [];
        let provider = new anchor.AnchorProvider(connection, new nodewallet_1.default(web3_js_1.Keypair.generate()), {
            skipPreflight: false,
            preflightCommitment: "recent",
            commitment: "recent",
        });
        const cyclosCore = new anchor_1.Program(sdk_1.IDL, types_1.CYKURA_PROGRAM_ID, provider);
        let waitLoad = [];
        for (let i = 0; i < programAccounts.length; i++) {
            let decoded = types_1.CYKURA_LAYOUT.decode(programAccounts[i].accountInfo.data);
            let pool = Object.assign(Object.assign({}, decoded), { poolAccount: programAccounts[i].publicKey.toBase58(), provider: "cykura", cyclosCore: cyclosCore });
            pool.vault0 = (0, pubkey_1.findProgramAddressSync)([new web3_js_1.PublicKey(pool.poolAccount).toBuffer(), new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID).toBuffer(), pool.mintA.toBuffer()], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID)[0];
            pool.vault1 = (0, pubkey_1.findProgramAddressSync)([new web3_js_1.PublicKey(pool.poolAccount).toBuffer(), new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID).toBuffer(), pool.mintB.toBuffer()], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID)[0];
            decodedAccounts.push(pool);
            //console.log(pool.quoteTokenVault.toBase58())
            //console.log(pool.baseTokenVault.toBase58())
            pool.tickProvider = new SolanaTickDataProvider(cyclosCore, {
                token0: pool.mintA,
                token1: pool.mintB,
                fee: pool.fee,
            });
            waitLoad.push(pool.tickProvider.eagerLoadCache(pool.tick, sdk_1.TICK_SPACINGS[pool.fee]));
        }
        yield Promise.all(waitLoad);
        let pools = {};
        for (let i = 0; i < programAccounts.length; i++) {
            let pool = decodedAccounts[i];
            let coinMint = pool.mintA.toBase58();
            let pcMint = pool.mintB.toBase58();
            //console.log(coinMint)
            //console.log(pcMint)
            (pools[coinMint] || (pools[coinMint] = [])).push(Object.assign(Object.assign({}, pool), { other: pcMint }));
            (pools[pcMint] || (pools[pcMint] = [])).push(Object.assign(Object.assign({}, pool), { other: coinMint }));
        }
        return pools;
    });
}
exports.getCykuraPools = getCykuraPools;
class SolanaTickDataProvider {
    // @ts-ignore
    constructor(program, pool) {
        this.program = program;
        this.pool = pool;
        this.bitmapCache = new Map();
        this.tickCache = new Map();
    }
    /**
     * Caches ticks and bitmap accounts near the current price
     * @param tickCurrent The current pool tick
     * @param tickSpacing The pool tick spacing
     */
    eagerLoadCache(tickCurrent, tickSpacing) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // fetch 10 bitmaps on each side in a single fetch. Find active ticks and read them together
            const compressed = jsbi_1.default.toNumber(jsbi_1.default.divide(jsbi_1.default.BigInt(tickCurrent), jsbi_1.default.BigInt(tickSpacing)));
            const { wordPos } = (0, sdk_1.tickPosition)(compressed);
            try {
                const bitmapsToFetch = [];
                const { wordPos: WORD_POS_MIN } = (0, sdk_1.tickPosition)(Math.floor(sdk_1.TickMath.MIN_TICK / tickSpacing));
                const { wordPos: WORD_POS_MAX } = (0, sdk_1.tickPosition)(Math.floor(sdk_1.TickMath.MAX_TICK / tickSpacing));
                const minWord = Math.max(wordPos - 10, WORD_POS_MIN);
                const maxWord = Math.min(wordPos + 10, WORD_POS_MAX);
                for (let i = minWord; i < maxWord; i++) {
                    bitmapsToFetch.push(this.getBitmapAddressSync(i));
                }
                const fetchedBitmaps = (yield this.program.account.tickBitmapState.fetchMultiple(bitmapsToFetch));
                const tickAddresses = [];
                for (let i = 0; i < maxWord - minWord; i++) {
                    const currentWordPos = i + minWord;
                    const wordArray = (_a = fetchedBitmaps[i]) === null || _a === void 0 ? void 0 : _a.word;
                    const word = wordArray ? (0, sdk_1.generateBitmapWord)(wordArray) : new bn_js_1.BN(0);
                    this.bitmapCache.set(currentWordPos, {
                        address: bitmapsToFetch[i],
                        word,
                    });
                    if (word && !word.eqn(0)) {
                        for (let j = 0; j < 256; j++) {
                            if (word.shrn(j).and(new bn_js_1.BN(1)).eqn(1)) {
                                const tick = ((currentWordPos << 8) + j) * tickSpacing;
                                const tickAddress = this.getTickAddressSync(tick);
                                tickAddresses.push(tickAddress);
                            }
                        }
                    }
                }
                const fetchedTicks = (yield this.program.account.tickState.fetchMultiple(tickAddresses));
                for (const i in tickAddresses) {
                    const { tick, liquidityNet } = fetchedTicks[i];
                    this.tickCache.set(tick, {
                        address: tickAddresses[i],
                        liquidityNet: jsbi_1.default.BigInt(liquidityNet),
                    });
                }
            }
            catch (error) {
            }
        });
    }
    getTickAddressSync(tick) {
        return (0, pubkey_1.findProgramAddressSync)([sdk_1.TICK_SEED, this.pool.token0.toBuffer(), this.pool.token1.toBuffer(), (0, sdk_1.u32ToSeed)(this.pool.fee), (0, sdk_1.u32ToSeed)(tick)], this.program.programId)[0];
    }
    getBitmapAddressSync(wordPos) {
        return (0, pubkey_1.findProgramAddressSync)([sdk_1.BITMAP_SEED, this.pool.token0.toBuffer(), this.pool.token1.toBuffer(), (0, sdk_1.u32ToSeed)(this.pool.fee), (0, sdk_1.u16ToSeed)(wordPos)], this.program.programId)[0];
    }
    getTick(tick) {
        const savedTick = this.tickCache.get(tick);
        if (!savedTick) {
            throw new Error('Tick not cached');
        }
        return {
            address: savedTick.address,
            liquidityNet: savedTick.liquidityNet,
        };
    }
    /**
     * Fetches the cached bitmap for the word
     * @param wordPos
     */
    getBitmap(wordPos) {
        const savedBitmap = this.bitmapCache.get(wordPos);
        if (!savedBitmap) {
            throw new Error('Bitmap not cached');
        }
        return savedBitmap;
    }
    /**
     * Finds the next initialized tick in the given word. Fetched bitmaps are saved in a
     * cache for quicker lookups in future.
     * @param tick The current tick
     * @param lte Whether to look for a tick less than or equal to the current one, or a tick greater than or equal to
     * @param tickSpacing The tick spacing for the pool
     * @returns
     */
    nextInitializedTickWithinOneWord(tick, lte, tickSpacing) {
        let compressed = jsbi_1.default.toNumber(jsbi_1.default.divide(jsbi_1.default.BigInt(tick), jsbi_1.default.BigInt(tickSpacing)));
        if (tick < 0 && tick % tickSpacing !== 0) {
            compressed -= 1;
        }
        if (!lte) {
            compressed += 1;
        }
        const { wordPos, bitPos } = (0, sdk_1.tickPosition)(compressed);
        const cachedBitmap = this.getBitmap(wordPos);
        const { next: nextBit, initialized } = (0, sdk_1.nextInitializedBit)(cachedBitmap.word, bitPos, lte);
        const nextTick = (0, sdk_1.buildTick)(wordPos, nextBit, tickSpacing);
        return [nextTick, initialized, wordPos, bitPos, cachedBitmap.address];
    }
}
exports.SolanaTickDataProvider = SolanaTickDataProvider;
