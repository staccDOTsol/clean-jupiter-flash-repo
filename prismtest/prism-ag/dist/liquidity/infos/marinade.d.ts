import { Connection, PublicKey } from "@solana/web3.js";
export declare const SOL_MINT = "So11111111111111111111111111111111111111112";
export declare const MARINADE_PROGRAM_ID = "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD";
export declare const MARINADE_STATE = "8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC";
export declare const MSOL_MINT = "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So";
export declare const LIQ_POOL_SOL_LEG_PDA = "UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q";
export declare const LIQ_POOL_MSOL_LEG = "7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE";
export declare const LIQ_POOL_MSOL_LEG_AUTHORITY = "EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL";
export declare const RESERVE_PDA = "Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN";
export declare const MSOL_MINT_AUTHORITY = "3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM";
export declare function _loadMarinade(liquidity: any): {
    account: PublicKey;
    provider: string;
}[];
export declare function loadMarinade(liquidity: any, connection: Connection, multipleInfo: any[]): any;
