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
exports.executeSwap = exports.sendAndConfirmTransaction = exports.generateTransactions = exports.generateSymmetryTransaction = exports.singleRoute = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const stats_1 = require("../utils/stats");
const aldrin_1 = require("./aldrin");
const crema_1 = require("./crema");
const helpers_1 = require("./helpers");
const idl_1 = require("./idl");
const lifinity_1 = require("./lifinity");
const orca_1 = require("./orca");
const raydium_1 = require("./raydium");
const saber_1 = require("./saber");
const serum_1 = require("./serum");
const cropper_1 = require("./cropper");
const sencha_1 = require("./sencha");
const symmetry_1 = require("./symmetry");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
const saros_1 = require("./saros");
const step_1 = require("./step");
const penguin_1 = require("./penguin");
const mercurial_1 = require("./mercurial");
const cykura_1 = require("./cykura");
const stepn_1 = require("./stepn");
const marinade_1 = require("./marinade");
const goosefx_1 = require("./goosefx");
const openbook_1 = require("./openbook");
const balansol_1 = require("./balansol");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function singleRoute(user, connection, settings, route, fromAcc, toAcc, fees, preTransaction, postTransaction, mainSigners, preSigners, openOrdersSerum, openOrdersOpenBook, useT = false, disableFees = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new anchor_1.AnchorProvider(connection, new nodewallet_1.default(web3_js_1.Keypair.generate()), {
            preflightCommitment: "recent",
            commitment: "recent",
        });
        const program = new anchor_1.Program(idl_1.PrismIDL, new web3_js_1.PublicKey("AGGZ2djPDEvrbgiBTV3P8UoB8Zf1kGawkWd2eu553o44"), provider);
        if (route.provider == "serum")
            return yield (0, serum_1.serumSwap)(user, connection, settings, program, route, fromAcc, toAcc, fees, preTransaction, preSigners, settings.host.fee, openOrdersSerum, useT, disableFees);
        if (route.provider == "raydium")
            return yield (0, raydium_1.raydiumSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "aldrin")
            return yield (0, aldrin_1.aldrinSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "saber")
            return yield (0, saber_1.saberSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "orca")
            return yield (0, orca_1.orcaSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "lifinity")
            return yield (0, lifinity_1.lifinitySwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "symmetry")
            return yield (0, symmetry_1.symmetrySwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "cropper")
            return yield (0, cropper_1.cropperSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "sencha")
            return yield (0, sencha_1.senchaSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "saros")
            return yield (0, saros_1.sarosSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "step")
            return yield (0, step_1.stepSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "penguin")
            return yield (0, penguin_1.penguinSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "mercurial")
            return yield (0, mercurial_1.mercurialSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "stepn")
            return yield (0, stepn_1.stepnSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "marinade")
            return yield (0, marinade_1.marinadeSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, preTransaction, postTransaction, mainSigners, useT, disableFees);
        if (route.provider == "crema")
            return yield (0, crema_1.cremaSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "cykura")
            return yield (0, cykura_1.cykuraSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
        if (route.provider == "gooseFX")
            return yield (0, goosefx_1.gooseFxSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, preTransaction, useT, disableFees);
        if (route.provider == 'openbook')
            return yield (0, openbook_1.openbookSwap)(user, connection, settings, program, route, fromAcc, toAcc, fees, preTransaction, preSigners, settings.host.fee, openOrdersOpenBook, useT, disableFees);
        if (route.provider == "balansol")
            return yield (0, balansol_1.balansolSwap)(user, program, route, fromAcc, toAcc, fees, settings.host.fee, useT, disableFees);
    });
}
exports.singleRoute = singleRoute;
function generateSymmetryTransaction(prism, route, fromTokenAccount, toTokenAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        const { publicKey, connection, settings, userOpenOrdersSerum, userOpenOrdersOpenBook } = prism;
        let signers = [];
        let transaction = new web3_js_1.Transaction();
        let ata = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(route.routeData.toCoin.mintAddress), settings.owner.publicKey);
        let fees = {
            host: ata,
            owner: ata,
        };
        let ix = yield singleRoute(publicKey, connection, settings, route, fromTokenAccount, toTokenAccount, fees, transaction, transaction, signers, signers, userOpenOrdersSerum, userOpenOrdersOpenBook);
        //@ts-ignore
        transaction.add(ix);
        return {
            transaction: transaction,
            signers: signers,
            mainSigners: [],
        };
    });
}
exports.generateSymmetryTransaction = generateSymmetryTransaction;
function generateTransactions(prism, route) {
    return __awaiter(this, void 0, void 0, function* () {
        const { publicKey, connection, settings, userAccounts, userOpenOrdersSerum, userOpenOrdersOpenBook } = prism;
        let preTransaction = new web3_js_1.Transaction();
        let preSigners = [];
        let mainSigners = [];
        let postTransaction = new web3_js_1.Transaction();
        let mainTx = new web3_js_1.Transaction();
        let { fromTokenAccount, midTokenAccount, toTokenAccount } = yield (0, helpers_1.prepareAccounts)(publicKey, userAccounts, connection, route, preTransaction, preSigners, postTransaction);
        let toFees = yield (0, helpers_1.generateFeesAccount)(connection, settings, publicKey, route.routeData.toCoin.mintAddress, preTransaction, route);
        let midFees = (route.type == "transitive") ? yield (0, helpers_1.generateFeesAccount)(connection, settings, publicKey, route.routeData.midCoin.mintAddress, preTransaction, route) : null;
        mainTx.add(web3_js_1.ComputeBudgetProgram.requestUnits({
            units: 100000000,
            additionalFee: 1380,
        }));
        if (route.type == "direct") {
            if (route.provider == 'gooseFX') {
                mainTx.add(web3_js_1.ComputeBudgetProgram.requestUnits({
                    units: 1000000,
                    additionalFee: 0,
                }));
            }
            let ix1 = yield singleRoute(publicKey, connection, settings, route, fromTokenAccount, toTokenAccount, toFees, preTransaction, postTransaction, mainSigners, preSigners, userOpenOrdersSerum, userOpenOrdersOpenBook);
            //@ts-ignore
            mainTx.add(ix1);
        }
        else if (route.type == "transitive") {
            let disableFees = false;
            if (route.routeData.route1.provider == "serum" && route.routeData.route2.provider == "raydium")
                disableFees = true;
            if (route.routeData.route1.provider == "raydium" && route.routeData.route2.provider == "serum")
                disableFees = true;
            if (route.routeData.route1.provider == "raydium" && route.routeData.route2.provider == "raydium")
                disableFees = true;
            if (route.routeData.route1.provider == "openbook" && route.routeData.route2.provider == "raydium")
                disableFees = true;
            if (route.routeData.route1.provider == "raydium" && route.routeData.route2.provider == "openbook")
                disableFees = true;
            if (route.routeData.route1.provider == 'gooseFX' || route.routeData.route2.provider == 'gooseFX') {
                mainTx.add(web3_js_1.ComputeBudgetProgram.requestUnits({
                    units: 1000000,
                    additionalFee: 0,
                }));
            }
            let ix1 = yield singleRoute(publicKey, connection, settings, route.routeData.route1, fromTokenAccount, midTokenAccount, midFees, preTransaction, postTransaction, mainSigners, preSigners, userOpenOrdersSerum, userOpenOrdersOpenBook, false, disableFees);
            let ix2 = yield singleRoute(publicKey, connection, settings, route.routeData.route2, midTokenAccount, toTokenAccount, toFees, preTransaction, postTransaction, mainSigners, preSigners, userOpenOrdersSerum, userOpenOrdersOpenBook, true, disableFees);
            //@ts-ignore
            mainTx.add(ix1);
            //@ts-ignore
            mainTx.add(ix2);
        }
        else if (route.type == "split") {
            let disableFees = false;
            if (route.routeData.route1.provider == "openbook" && route.routeData.route2.provider == "raydium")
                disableFees = true;
            if (route.routeData.route1.provider == "raydium" && route.routeData.route2.provider == "openbook")
                disableFees = true;
            if (route.routeData.route1.provider == 'gooseFX' || route.routeData.route2.provider == 'gooseFX') {
                mainTx.add(web3_js_1.ComputeBudgetProgram.requestUnits({
                    units: 1000000,
                    additionalFee: 0,
                }));
            }
            let ix1 = yield singleRoute(publicKey, connection, settings, route.routeData.route1, fromTokenAccount, toTokenAccount, toFees, preTransaction, postTransaction, mainSigners, preSigners, userOpenOrdersSerum, userOpenOrdersOpenBook, false, disableFees);
            let ix2 = yield singleRoute(publicKey, connection, settings, route.routeData.route2, fromTokenAccount, toTokenAccount, toFees, preTransaction, postTransaction, mainSigners, preSigners, userOpenOrdersSerum, userOpenOrdersOpenBook, false, disableFees);
            //@ts-ignore
            mainTx.add(ix1);
            //@ts-ignore
            mainTx.add(ix2);
        }
        return {
            preTransaction: preTransaction,
            preSigners: preSigners,
            mainSigners: mainSigners,
            mainTransaction: mainTx,
            postTransaction: postTransaction,
            fromTokenAccount: fromTokenAccount,
            midTokenAccount: midTokenAccount,
            toTokenAccount: toTokenAccount,
            toFees: toFees,
            midFees: midFees,
        };
    });
}
exports.generateTransactions = generateTransactions;
function sendAndConfirmTransaction(connection, serialized) {
    return __awaiter(this, void 0, void 0, function* () {
        let tries = 0;
        let signature = null;
        let signatureResponse = null;
        while (true) {
            connection.sendRawTransaction(serialized, { skipPreflight: true }).catch((e) => {
                return null;
            }).then(result => { if (!signature)
                signature = result; });
            if (signature) {
                if (tries % 2 == 0) {
                    let response = yield connection.getTransaction(signature, { commitment: "confirmed" }).catch(() => { return "Error"; });
                    if (response) {
                        signatureResponse = response;
                        break;
                    }
                }
            }
            tries = tries + 1;
            if (tries == 30)
                break;
            yield sleep(1000);
        }
        return {
            signature: signature,
            response: signatureResponse
        };
    });
}
exports.sendAndConfirmTransaction = sendAndConfirmTransaction;
function executeSwap(prism, route) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, publicKey, connection, settings } = prism;
        let { preTransaction, preSigners, mainTransaction, postTransaction, toFees, midFees, fromTokenAccount, midTokenAccount, toTokenAccount, mainSigners, } = yield generateTransactions(prism, route);
        const { txIndex, transactions } = yield (0, helpers_1.applyBlockHashAndPartialSign)(connection, user, preTransaction, mainTransaction, postTransaction, preSigners, mainSigners);
        const signedTxs = yield user.signAllTransactions(transactions);
        let serialized = [];
        for (let i = 0; i < signedTxs.length; i++)
            serialized.push(signedTxs[i].serialize());
        let result = {
            fromMint: route.routeData.fromCoin.mintAddress,
            toMint: route.routeData.toCoin.mintAddress,
            midMint: route.routeData.midCoin ? route.routeData.midCoin.mintAddress : null,
            from: route.from,
            to: route.to,
            mid: route.mid ? route.mid : null,
        };
        for (let i = 0; i < serialized.length; i++) {
            const { signature, response } = yield sendAndConfirmTransaction(connection, serialized[i]);
            if (i != txIndex && i == 0)
                result.preTxId = signature;
            if (i != txIndex && i == serialized.length - 1)
                result.postTxId = signature;
            if (i == txIndex)
                result = Object.assign(Object.assign({}, result), { txId: signature, response: response });
        }
        let stats = (0, stats_1.getStats)(settings, publicKey, route, result, toFees, midFees, fromTokenAccount, midTokenAccount, toTokenAccount);
        result.response = yield (0, helpers_1.parseMeta)(result.response, result.txId, result);
        return Object.assign(Object.assign({}, result), { expectations: stats.message });
    });
}
exports.executeSwap = executeSwap;
