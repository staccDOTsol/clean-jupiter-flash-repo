import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
export declare const TOKEN_LIST_URI = "https://d2o6auu6zcqb6o.cloudfront.net/tokenlist.json";
export declare const SABER_SWAPS = "https://raw.githubusercontent.com/saber-hq/saber-registry-dist/master/data/swaps.mainnet.json";
export declare const ENDPOINT = "https://solana-api.projectserum.com/";
export declare const KNOWN_PAIRS = "https://d2o6auu6zcqb6o.cloudfront.net/pairs.json";
export declare const PRISM_OWNER = "3qgS5KYBTFJ6Lt8GujDEQLcgfLPSnFZ5VFMrxoes7rXs";
export declare const TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export declare const LIQUIDITY_POOL_PROGRAM_ID_V4 = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
export declare const SERUM_PROGRAM_ID_V3 = "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin";
export declare const OPENBOOK_PROGRAM_ID = "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX";
export declare const CREMA_PROGRAM_ID = "6MLxLqiXaaSUpkgMnWDTuejNZEz3kE7k2woyHGVFw319";
export declare const LIFINITY_PROGRAM_ID = "EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S";
export declare const CROPPER_PROGRAM_ID = "CTMAxxk34HjKWxQ3QLZK1HpaLXmBveao3ESePXbiyfzh";
export declare const CROPPER_STATE_ACCOUNT = "3hsU1VgsBgBgz5jWiqdw9RfGU6TpWdCmdah1oi4kF3Tq";
export declare const CROPPER_FEE_ACCOUNT = "DyDdJM9KVsvosfXbcHDp4pRpmbMHkRq3pcarBykPy4ir";
export declare const SABER_PROGRAM_ID = "addresses";
export declare const MERCURIAL_PROGRAM_ID = "MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky";
export declare const SENCHA_PROGRAM_ID = "SCHAtsf8mbjyjiv4LkhLKutTf6JnZAbdJKFkXQNMFHZ";
export declare const SAROS_PROGRAM_ID = "SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr";
export declare const STEP_PROGRAM_ID = "SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1";
export declare const PENGUIN_PROGRAM_ID = "PSwapMdSai8tjrEXcxFeQth87xC4rRsa4VA5mhGhXkP";
export declare const CYKURA_PROGRAM_ID = "cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8";
export declare const CYKURA_FACTORY_STATE_ADDRESS = "DBsMwKfeoUHhxMi9x6wd2AsT12UwUCssjNbUzu1aKgqj";
export declare const STEPN_PROGRAM_ID = "Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j";
export declare const MARINADE_PROGRAM_ID = "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD";
export declare const MARINADE_STATE = "8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC";
export declare const MSOL_MINT = "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So";
export declare const LIQ_POOL_SOL_LEG_PDA = "UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q";
export declare const LIQ_POOL_MSOL_LEG = "7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE";
export declare const LIQ_POOL_MSOL_LEG_AUTHORITY = "EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL";
export declare const RESERVE_PDA = "Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN";
export declare const MSOL_MINT_AUTHORITY = "3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM";
export declare const GOOSEFX_PROGRAM = "7WduLbRfYhTJktjLw5FDEyrqoEv61aTTCuGAetgLjzN5";
export declare const GOOSEFX_CONTROLLER = "8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ";
export declare const TRANSITIVE_STATE = "5EUiihMbweSuBAFgU5KR7X1x8TJapNRaf9AyAXk73vC8";
export declare const TRANSITIVE_STATE_OLD = "HXgqkq5hn6QxrtJmtPW7igf7G4mrxbqS5c8NQybnxYi2";
export declare const MIDDLE_COINS: Array<TokenInfo>;
export interface TokenInfo {
    symbol: string;
    mintAddress: string;
    decimals: number;
    coingeckoId?: string;
}
export interface TokenList {
    tokens: Array<any>;
}
export interface LiqProviders {
    serum?: boolean;
    saber?: boolean;
    raydium?: boolean;
    aldrin?: boolean;
    orca?: boolean;
    lifinity?: boolean;
    symmetry?: boolean;
    cropper?: boolean;
    sencha?: boolean;
    saros?: boolean;
    step?: boolean;
    penguin?: boolean;
    mercurial?: boolean;
    stepn?: boolean;
    marinade?: boolean;
    cykura?: boolean;
    gooseFX?: boolean;
    openbook?: boolean;
    balansol?: boolean;
}
export interface PrismLoadParams {
    user?: Keypair | Wallet | PublicKey;
    connection?: Connection;
    tokenList?: TokenList;
    host?: {
        publicKey: string;
        fee: number;
    };
    slippage?: number;
    liqProviders?: LiqProviders;
}
export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}
export declare const MINT_LAYOUT: any;
export declare const ACCOUNT_LAYOUT: any;
export declare const AMM_INFO_LAYOUT: any;
export declare const AMM_INFO_LAYOUT_V3: any;
export declare const AMM_INFO_LAYOUT_V4: any;
export declare const AMM_INFO_LAYOUT_STABLE: any;
export declare const CROPPER_TOKEN_SWAP_LAYOUT: any;
export declare const MERCURIAL_SWAP_LAYOUT: any;
export declare const SENCHA_SWAP_LAYOUT: any;
export declare const SAROS_SWAP_LAYOUT: any;
export declare const STEP_SWAP_LAYOUT: any;
export declare const SERUM_LAYOUT: any;
export declare const CYKURA_LAYOUT: any;
