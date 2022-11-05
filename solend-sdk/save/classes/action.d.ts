import { Connection, PublicKey, Transaction, TransactionInstruction, TransactionSignature } from "@solana/web3.js";
import BN from "bn.js";
import { Obligation } from "../state/obligation";
import { ReserveConfigType, MarketConfigType } from "./shared";
export declare const POSITION_LIMIT = 6;
export declare type ActionType = "deposit" | "borrow" | "withdraw" | "repay" | "mint" | "redeem" | "depositCollateral";
export declare class SolendAction {
    programId: PublicKey;
    connection: Connection;
    reserve: ReserveConfigType;
    lendingMarket: MarketConfigType;
    publicKey: PublicKey;
    obligationAddress: PublicKey;
    obligationAccountInfo: Obligation | null;
    userTokenAccountAddress: PublicKey;
    userCollateralAccountAddress: PublicKey;
    seed: string;
    symbol: string;
    positions?: number;
    amount: BN;
    hostAta?: PublicKey;
    setupIxs: Array<TransactionInstruction>;
    lendingIxs: Array<TransactionInstruction>;
    cleanupIxs: Array<TransactionInstruction>;
    preTxnIxs: Array<TransactionInstruction>;
    postTxnIxs: Array<TransactionInstruction>;
    depositReserves: Array<PublicKey>;
    borrowReserves: Array<PublicKey>;
    private constructor();
    static initialize(action: ActionType, amount: string | BN, symbol: string, publicKey: PublicKey, connection: Connection, environment?: "production" | "devnet", lendingMarketAddress?: PublicKey, hostAta?: PublicKey): Promise<SolendAction>;
    static buildDepositTxns(connection: Connection, amount: string | BN, symbol: string, publicKey: PublicKey, environment?: "production" | "devnet", lendingMarketAddress?: PublicKey): Promise<SolendAction>;
    static buildBorrowTxns(connection: Connection, amount: string | BN, symbol: string, publicKey: PublicKey, environment?: "production" | "devnet", hostAta?: PublicKey, lendingMarketAddress?: PublicKey): Promise<SolendAction>;
    static buildDepositReserveLiquidityTxns(connection: Connection, amount: string | BN, symbol: string, publicKey: PublicKey, environment?: "production" | "devnet", lendingMarketAddress?: PublicKey): Promise<SolendAction>;
    static buildRedeemReserveCollateralTxns(connection: Connection, amount: string | BN, symbol: string, publicKey: PublicKey, environment?: "production" | "devnet", lendingMarketAddress?: PublicKey): Promise<SolendAction>;
    static buildDepositObligationCollateralTxns(connection: Connection, amount: string | BN, symbol: string, publicKey: PublicKey, environment?: "production" | "devnet", lendingMarketAddress?: PublicKey): Promise<SolendAction>;
    static buildWithdrawTxns(connection: Connection, amount: string | BN, symbol: string, publicKey: PublicKey, environment?: "production" | "devnet", lendingMarketAddress?: PublicKey): Promise<SolendAction>;
    static buildRepayTxns(connection: Connection, amount: string | BN, symbol: string, publicKey: PublicKey, environment?: "production" | "devnet", lendingMarketAddress?: PublicKey): Promise<SolendAction>;
    getTransactions(): Promise<{
        preLendingTxn: Transaction | null;
        lendingTxn: Transaction | null;
        postLendingTxn: Transaction | null;
    }>;
    sendTransactions(sendTransaction: (txn: Transaction, connection: Connection) => Promise<TransactionSignature>): Promise<string>;
    private sendSingleTransaction;
    addDepositIx(): void;
    addDepositReserveLiquidityIx(): void;
    addRedeemReserveCollateralIx(): void;
    addDepositObligationCollateralIx(): void;
    addBorrowIx(): void;
    addWithdrawIx(): Promise<void>;
    addRepayIx(): Promise<void>;
    addSupportIxs(action: ActionType): Promise<void>;
    private addRefreshIxs;
    private addObligationIxs;
    private addAtaIxs;
    private updateWSOLAccount;
}