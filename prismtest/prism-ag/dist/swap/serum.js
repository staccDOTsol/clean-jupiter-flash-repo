"use strict";
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
exports.serumSwap = void 0;
const anchor_1 = require("@project-serum/anchor");
const serum_1 = require("@project-serum/serum");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const types_1 = require("../types/types");
const serumIdl_1 = require("./serumIdl");
const bn_js_1 = __importDefault(require("bn.js"));
function serumSwap(user, connection, settings, program, route, fromTokenAccount, toTokenAccount, fees, preTransaction, preSigners, hostFees, userOpenOrders, useT = null, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new anchor_1.AnchorProvider(connection, 
        //@ts-ignore
        undefined, {
            preflightCommitment: "recent",
            commitment: "recent",
        });
        const serumProgram = new anchor_1.Program(serumIdl_1.IDL, new web3_js_1.PublicKey("22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD"), provider);
        let { fromCoin, toCoin, side, marketConfig } = route.routeData;
        let market = marketConfig.market;
        let openOrders = null;
        if (!userOpenOrders) {
            let openOrdersArr = yield serum_1.OpenOrders.findForMarketAndOwner(connection, market.address, user, new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3));
            if (openOrdersArr && openOrdersArr.length > 0)
                openOrders = openOrdersArr[0].address;
        }
        else {
            for (let i = 0; i < userOpenOrders.length; i++)
                if (userOpenOrders[i].market.toBase58() == market.address.toBase58())
                    openOrders = userOpenOrders[i].address;
        }
        if (!openOrders) {
            let account = new web3_js_1.Keypair();
            preTransaction.add(yield serum_1.OpenOrders.makeCreateAccountTransaction(connection, market.address, user, account.publicKey, new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3)));
            let initTx = yield serumProgram.instruction.initAccount({
                accounts: {
                    openOrders: account.publicKey,
                    authority: user,
                    market: market.address,
                    dexProgram: new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3),
                    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                },
            });
            openOrders = account.publicKey;
            preSigners.push(account);
            preTransaction.add(initTx);
        }
        //@ts-ignore
        const marketDecoded = market._decoded;
        const marketVaultSigner = yield web3_js_1.PublicKey.createProgramAddress([market.address.toBuffer(), marketDecoded.vaultSignerNonce.toArrayLike(Buffer, 'le', 8)], 
        //@ts-ignore
        market._programId);
        let referral = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey((side == "buy") ? new web3_js_1.PublicKey(fromCoin.mintAddress) : new web3_js_1.PublicKey(toCoin.mintAddress)), settings.owner.publicKey);
        const info = yield connection.getAccountInfo(referral);
        if (!info) {
            preTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey((side == "buy") ? new web3_js_1.PublicKey(toCoin.mintAddress) : new web3_js_1.PublicKey(fromCoin.mintAddress)), referral, settings.owner.publicKey, user));
        }
        return program.instruction.serumSwap(new bn_js_1.default(route.amountIn * 10 ** fromCoin.decimals), new bn_js_1.default(route.minimumReceived * 10 ** toCoin.decimals), useT ? true : false, (side == "buy") ? new bn_js_1.default(0) : new bn_js_1.default(1), disableFees, new bn_js_1.default(hostFees), {
            accounts: {
                serumDexProgram: new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3),
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                serumInfo: {
                    market: marketDecoded.ownAddress,
                    bids: marketDecoded.bids,
                    asks: marketDecoded.asks,
                    eventQueue: marketDecoded.eventQueue,
                    coinVault: marketDecoded.baseVault,
                    pcVault: marketDecoded.quoteVault,
                    vaultSigner: marketVaultSigner,
                },
                openOrders: openOrders,
                requestQueue: marketDecoded.requestQueue,
                authority: user,
                toTokenAccount: toTokenAccount,
                fromTokenAccount: fromTokenAccount,
                feeSweeper: disableFees ? user : fees.owner,
                referral: referral,
                transitiveState: new web3_js_1.PublicKey(types_1.TRANSITIVE_STATE),
                host: disableFees ? user : fees.host,
            },
        });
    });
}
exports.serumSwap = serumSwap;
