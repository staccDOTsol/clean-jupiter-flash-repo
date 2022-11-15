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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolendClaim = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const psy_american_1 = require("@mithraic-labs/psy-american");
const anchor = __importStar(require("@project-serum/anchor"));
const merkle_distributor_1 = require("../utils/merkle_distributor");
const toBytes32Array = (b) => {
    const buf = Buffer.alloc(32);
    b.copy(buf, 32 - b.length);
    return Array.from(buf);
};
class SolendClaim {
    constructor(metadata, provider) {
        this.metadata = metadata;
        this.provider = provider;
    }
    getExerciseIxs(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.metadata.optionMarketKey) {
                throw Error("This reward is not an option and does not need to be exercised");
            }
            const psyOptionsProgram = new anchor.Program(psy_american_1.PsyAmericanIdl, new web3_js_1.PublicKey("R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs"), this.provider);
            // Mint a bunch of contracts to the minter
            const optionMarket = yield (0, psy_american_1.getOptionByKey)(psyOptionsProgram, new web3_js_1.PublicKey(this.metadata.optionMarketKey));
            if (!optionMarket) {
                throw new Error("Option market with that key is not found.");
            }
            const setupIxs = [];
            const exerciseIxs = [];
            const claimantTokenAccountAddress = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, optionMarket.underlyingAssetMint, this.provider.wallet.publicKey, true);
            const claimantTokenAccountInfo = yield this.provider.connection.getAccountInfo(claimantTokenAccountAddress);
            if (!claimantTokenAccountInfo) {
                const createUserTokenAccountIx = spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, optionMarket.underlyingAssetMint, claimantTokenAccountAddress, this.provider.wallet.publicKey, this.provider.wallet.publicKey);
                setupIxs.push(createUserTokenAccountIx);
            }
            const exerciserOptionTokenSrc = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, optionMarket.optionMint, this.provider.wallet.publicKey);
            const underlyingAssetDest = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, optionMarket.underlyingAssetMint, this.provider.wallet.publicKey);
            const quoteAssetSrc = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, optionMarket.quoteAssetMint, this.provider.wallet.publicKey);
            if (!optionMarket) {
                throw new Error("Option market with that key is not found.");
            }
            const exerciseOptionIx = psyOptionsProgram.instruction.exerciseOptionV2(new anchor.BN(amount), {
                accounts: {
                    userAuthority: this.provider.wallet.publicKey,
                    optionAuthority: this.provider.wallet.publicKey,
                    optionMarket: optionMarket.key,
                    optionMint: optionMarket.optionMint,
                    exerciserOptionTokenSrc,
                    underlyingAssetPool: optionMarket.underlyingAssetPool,
                    underlyingAssetDest,
                    quoteAssetPool: optionMarket.quoteAssetPool,
                    quoteAssetSrc,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                },
            });
            exerciseIxs.push(exerciseOptionIx);
            return [setupIxs, exerciseIxs];
        });
    }
    getClaimIxs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.metadata.claimable || this.metadata.claimedAt) {
                return [[], []];
            }
            const anchorProgram = new anchor.Program(merkle_distributor_1.MerkleDistributorJSON, new web3_js_1.PublicKey(merkle_distributor_1.MERKLE_PROGRAM_ID), this.provider);
            const setupIxs = [];
            const claimIxs = [];
            const claimantTokenAccountAddress = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, this.metadata.distributor.mint, this.provider.wallet.publicKey, true);
            const claimantTokenAccountInfo = yield this.provider.connection.getAccountInfo(claimantTokenAccountAddress);
            if (!claimantTokenAccountInfo) {
                const createUserTokenAccountIx = spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, this.metadata.distributor.mint, claimantTokenAccountAddress, this.provider.wallet.publicKey, this.provider.wallet.publicKey);
                setupIxs.push(createUserTokenAccountIx);
            }
            const claimIx = anchorProgram.instruction.claim(this.metadata.claimStatusBump, new anchor.BN(this.metadata.index), new anchor.BN(this.metadata.quantity), this.metadata.proof.map((p) => toBytes32Array(Buffer.from(p, "hex"))), {
                accounts: {
                    distributor: this.metadata.distributorPublicKey,
                    claimStatus: this.metadata.claimId,
                    from: this.metadata.distributorATAPublicKey,
                    to: claimantTokenAccountAddress,
                    claimant: this.provider.wallet.publicKey,
                    payer: this.provider.wallet.publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                },
            });
            claimIxs.push(claimIx);
            return [setupIxs, claimIxs];
        });
    }
    claim() {
        return __awaiter(this, void 0, void 0, function* () {
            const [setupIxs, claimIxs] = yield this.getClaimIxs();
            return yield this.provider.sendAndConfirm(new web3_js_1.Transaction().add(...setupIxs, ...claimIxs));
        });
    }
}
exports.SolendClaim = SolendClaim;
