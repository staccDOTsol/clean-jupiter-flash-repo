import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { ReserveConfig } from "../state/reserve";
export declare const updateReserveConfig: (reserve: PublicKey, lendingMarket: PublicKey, lendingMarketAuthority: PublicKey, lendingMarketOwner: PublicKey, pythProduct: PublicKey, pythPrice: PublicKey, switchboardOracle: PublicKey, reserveConfig: ReserveConfig, solendProgramAddress: PublicKey) => TransactionInstruction;
