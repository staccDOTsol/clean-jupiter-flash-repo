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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var prism_ag_1 = require("@prism-hq/prism-ag");
var classes_1 = require("./solend-sdk/save/classes");
var getOrCreateAssociatedTokenAccount_mjs_1 = require("./spl-token/lib/esm/actions/getOrCreateAssociatedTokenAccount.mjs");
var transfer_mjs_1 = require("./spl-token/lib/esm/instructions/transfer.mjs");
var flashRepayReserveLiquidity_1 = require("./solend-sdk/save/instructions/flashRepayReserveLiquidity");
var solend_sdk_1 = require("@solendprotocol/solend-sdk");
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = require("bs58");
var jaregms = {
    mSOL: "98ujMj4PcFBN6Rd4VRdELdwFMHEGtfGuN6uiTUs3QVPV",
    stSOL: "BgPgvbe11wMVGazRrX1jNgQnKzpRpPt1AVFHFenEtbAH",
    UST: "HtGvMME7965JxDfmUb2oQLWK3mfQxqRQGXXjigZDZoHH",
    MNGO: "GLnrq65xDUJWNWZwWvvPjzShTRMZq1gfAQawG7JuPbf3",
    PAI: "3PYf2cTZ2nYYy8JpJSPDyGAa4BS2esmwCzFA5nMod7Te",
    UXD: "6skAHGJNNDmtu1xE31gh2UaLS4YBuNT6cTjUFnBNMb7x",
    USDC: "HDuQnmkrezSY5FcPaERXA7pfnHSXDBYr5qMHd8CrwVRx",
    USDT: "BmsFXvuVUPooGhY8tkPGNrmwSEJ2P5SjifJm8XxbC86W",
    COPE: "FzsfC5sR4fw4osomUrFLUMjndzxnB6NV2V8FB7ScedMk",
    xUSD: "CmFKE3YUWGFH38Bg7M75zFFZU88XGRbiK4TNcTWUDVzs",
    DAI: "CVAFZGUTEjQTyGTceehsjjwUFVDKVMuWQZA22az8EvBg",
    USH: "7LbJDjdz5zChz4aTRj2TpBQTbg8rUKtcnYVodL3TeLw2",
    USDH: "rUxhyCLZD6tWqfdrD6HzDUceJSJdrddVGg834u2N9Lk"
};
var wallet = web3_js_1.Keypair.fromSecretKey(
// @ts-ignore
bs58_1["default"].decode(process.env.SOLANA_WALLET_PRIVATE_KEY));
console.log(wallet.publicKey.toBase58());
var connection = new web3_js_1.Connection("https://solana-mainnet.g.alchemy.com/v2/Zf8WbWIes5Ivksj_dLGL_txHMoRA7-Kr", "singleGossip");
var SOLEND_PRODUCTION_PROGRAM_ID = new web3_js_1.PublicKey("E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa");
setTimeout(function () {
    return __awaiter(this, void 0, void 0, function () {
        var prism, market, goaccs, goluts, _i, goluts_1, golut, test, err_1, mod, i, reserve, symbol, token, pubkey, amount, _a, pubkey_1, pk, amountToTrade, routes, tokenAccount, _b, _c, abc, _d, preTransaction, mainTransaction, instructions, _e, _f, _g, _h, messageV00, _j, transaction, result, err_2, err_3, err_4;
        var _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, prism_ag_1.Prism.init({
                        // user executing swap
                        user: wallet,
                        // rpc connection
                        connection: connection,
                        // slippage
                        slippage: 6
                    })];
                case 1:
                    prism = _l.sent();
                    return [4 /*yield*/, classes_1.SolendMarket.initialize(connection, "production")];
                case 2:
                    market = _l.sent();
                    goaccs = [];
                    goluts = [
                        "BYCAUgBHwZaVXZsbH7ePZro9YVFKChLE8Q6z4bUvkF1f",
                        "5taqdZKrVg4UM2wT6p2DGVY1uFnsV6fce3auQvcxMCya",
                        "2V7kVs1TsZv7j38UTv4Dgbc6h258KS8eo5GZL9yhxCjv",
                        "9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC",
                        "2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi",
                    ];
                    _i = 0, goluts_1 = goluts;
                    _l.label = 3;
                case 3:
                    if (!(_i < goluts_1.length)) return [3 /*break*/, 31];
                    golut = goluts_1[_i];
                    _l.label = 4;
                case 4:
                    _l.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, connection.getAddressLookupTable(new web3_js_1.PublicKey(golut))];
                case 5:
                    test = (_l.sent())
                        .value;
                    if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
                        goaccs.push(test);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _l.sent();
                    console.log(err_1);
                    return [3 /*break*/, 7];
                case 7:
                    mod = 100;
                    _l.label = 8;
                case 8:
                    if (!true) return [3 /*break*/, 30];
                    i = 1;
                    _l.label = 9;
                case 9:
                    if (!(i <= 13)) return [3 /*break*/, 29];
                    _l.label = 10;
                case 10:
                    _l.trys.push([10, 27, , 28]);
                    reserve = market.reserves[i];
                    symbol = reserve.config.asset;
                    token = {
                        address: reserve.config.liquidityToken.mint,
                        decimals: reserve.config.liquidityToken.decimals,
                        symbol: symbol
                    };
                    return [4 /*yield*/, connection.getParsedTokenAccountsByOwner(new web3_js_1.PublicKey("HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV"), { mint: new web3_js_1.PublicKey(token.address) })];
                case 11:
                    pubkey = (_l.sent()).value;
                    amount = 0;
                    for (_a = 0, pubkey_1 = pubkey; _a < pubkey_1.length; _a++) {
                        pk = pubkey_1[_a];
                        if (parseFloat(pk.account.data.parsed.info.tokenAmount.uiAmount) >
                            amount) {
                            amount = parseInt(pk.account.data.parsed.info.tokenAmount.amount);
                        }
                    }
                    amountToTrade = Math.floor(amount * (mod / 100));
                    return [4 /*yield*/, prism.loadRoutes(token.address, token.address)];
                case 12:
                    _l.sent(); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
                    routes = prism.getRoutes(amountToTrade / Math.pow(10, token.decimals));
                    return [4 /*yield*/, (0, getOrCreateAssociatedTokenAccount_mjs_1.getOrCreateAssociatedTokenAccount)(connection, // connection
                        wallet, // fee payer
                        new web3_js_1.PublicKey(reserve.config.liquidityToken.mint), wallet.publicKey, true // mint
                        )];
                case 13:
                    tokenAccount = (_l.sent()).address;
                    _b = 0, _c = [0, 1, 2, 3, 4];
                    _l.label = 14;
                case 14:
                    if (!(_b < _c.length)) return [3 /*break*/, 26];
                    abc = _c[_b];
                    if (!(routes[abc].amountOut > routes[abc].amountIn * 1.01)) return [3 /*break*/, 25];
                    _l.label = 15;
                case 15:
                    _l.trys.push([15, 24, , 25]);
                    return [4 /*yield*/, prism.generateSwapTransactions(routes[abc])];
                case 16:
                    _d = _l.sent(), preTransaction = _d.preTransaction, mainTransaction = _d.mainTransaction;
                    _e = [__spreadArray(__spreadArray(__spreadArray([], preTransaction.instructions, true), [
                            (0, solend_sdk_1.flashBorrowReserveLiquidityInstruction)(amountToTrade, new web3_js_1.PublicKey(reserve.config.liquidityAddress), tokenAccount, new web3_js_1.PublicKey(reserve.config.address), new web3_js_1.PublicKey(market.config.address), SOLEND_PRODUCTION_PROGRAM_ID)
                        ], false), mainTransaction.instructions, true)];
                    _f = [(0, flashRepayReserveLiquidity_1.flashRepayReserveLiquidityInstruction)(amountToTrade, preTransaction.instructions.length, tokenAccount, new web3_js_1.PublicKey(reserve.config.liquidityAddress), new web3_js_1.PublicKey(reserve.config.liquidityAddress), tokenAccount, new web3_js_1.PublicKey(reserve.config.address), new web3_js_1.PublicKey(market.config.address), wallet.publicKey, SOLEND_PRODUCTION_PROGRAM_ID, jaregms[token.symbol], new web3_js_1.PublicKey(reserve.config.liquidityToken.mint))];
                    _g = transfer_mjs_1.createTransferInstruction;
                    _h = [tokenAccount,
                        jaregms[token.symbol],
                        wallet.publicKey];
                    return [4 /*yield*/, connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                            mint: new web3_js_1.PublicKey(reserve.config.liquidityToken.mint)
                        })];
                case 17:
                    instructions = __spreadArray.apply(void 0, _e.concat([_f.concat([
                            _g.apply(void 0, _h.concat([// from's owner
                                (_l.sent()).value[0].account.data.parsed.info.tokenAmount.amount]))
                        ]), false]));
                    _j = web3_js_1.TransactionMessage.bind;
                    _k = {
                        payerKey: wallet.publicKey
                    };
                    // @ts-ignore
                    return [4 /*yield*/, connection.getLatestBlockhash()];
                case 18: return [4 /*yield*/, (
                    // @ts-ignore
                    _l.sent()).blockhash];
                case 19:
                    messageV00 = new (_j.apply(web3_js_1.TransactionMessage, [void 0, (_k.recentBlockhash = _l.sent(),
                            _k.instructions = instructions,
                            _k)]))().compileToV0Message(goaccs);
                    transaction = new web3_js_1.VersionedTransaction(messageV00);
                    result = void 0;
                    _l.label = 20;
                case 20:
                    _l.trys.push([20, 22, , 23]);
                    transaction.sign([wallet]);
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, 
                        // @ts-ignore
                        transaction, { skipPreflight: false }, { skipPreflight: false })];
                case 21:
                    result = _l.sent();
                    console.log("tx: " + result);
                    return [3 /*break*/, 23];
                case 22:
                    err_2 = _l.sent();
                    console.log(err_2);
                    return [3 /*break*/, 23];
                case 23:
                    if (result != undefined) {
                        mod = mod * 4;
                    }
                    else {
                        mod = mod / 1.666;
                    }
                    return [3 /*break*/, 25];
                case 24:
                    err_3 = _l.sent();
                    return [3 /*break*/, 25];
                case 25:
                    _b++;
                    return [3 /*break*/, 14];
                case 26: return [3 /*break*/, 28];
                case 27:
                    err_4 = _l.sent();
                    console.log(err_4);
                    return [3 /*break*/, 28];
                case 28:
                    i++;
                    return [3 /*break*/, 9];
                case 29: return [3 /*break*/, 8];
                case 30:
                    _i++;
                    return [3 /*break*/, 3];
                case 31: return [2 /*return*/];
            }
        });
    });
});
