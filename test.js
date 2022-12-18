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
var spl_token_1 = require("./spl-token/");
var spl_token_2 = require("./spl-token/");
var flashRepayReserveLiquidity_1 = require("./solend-sdk/save/instructions/flashRepayReserveLiquidity");
var solend_sdk_1 = require("@solendprotocol/solend-sdk");
var web3_js_1 = require("@solana/web3.js");
var fs_1 = require("fs");
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
function findLuts(address) {
    return __awaiter(this, void 0, void 0, function () {
        var goaccs, somejson, _i, _a, addpair, _b, _c, l, test, err_1, err_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    goaccs = [];
                    somejson = JSON.parse(fs_1["default"].readFileSync('./luts.json').toString());
                    _i = 0, _a = Object.keys(somejson);
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    addpair = _a[_i];
                    if (!(addpair.indexOf(address) != -1)) return [3 /*break*/, 10];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 9, , 10]);
                    _b = 0, _c = (somejson)[addpair];
                    _d.label = 3;
                case 3:
                    if (!(_b < _c.length)) return [3 /*break*/, 8];
                    l = _c[_b];
                    if (!(goaccs.length < 35)) return [3 /*break*/, 7];
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, connection.getAddressLookupTable(new web3_js_1.PublicKey(l))];
                case 5:
                    test = (_d.sent()).value;
                    // @ts-ignore
                    if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
                        // @ts-ignore
                        goaccs.push(test);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _d.sent();
                    return [3 /*break*/, 7];
                case 7:
                    _b++;
                    return [3 /*break*/, 3];
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_2 = _d.sent();
                    console.log(err_2);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11:
                    console.log("found " + goaccs.length.toString() + " luts...");
                    return [2 /*return*/, goaccs];
            }
        });
    });
}
var tgoaccs = {};
var prism, market, goaccs, goluts;
setTimeout(function () {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, res, _b, goluts_1, golut, test, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, prism_ag_1.Prism.init({
                        // user executing swap
                        user: wallet,
                        // rpc connection
                        connection: connection,
                        // slippage
                        slippage: 100
                    })];
                case 1:
                    prism = _c.sent();
                    return [4 /*yield*/, classes_1.SolendMarket.initialize(connection, "production")];
                case 2:
                    market = _c.sent();
                    for (_i = 0, _a = market.reserves; _i < _a.length; _i++) {
                        res = _a[_i];
                        tokenbs.push({
                            address: res.config.liquidityToken.mint,
                            decimals: res.config.liquidityToken.decimals,
                            symbol: res.config.asset
                        });
                    }
                    goaccs = [];
                    goluts = [
                        "BYCAUgBHwZaVXZsbH7ePZro9YVFKChLE8Q6z4bUvkF1f",
                        "5taqdZKrVg4UM2wT6p2DGVY1uFnsV6fce3auQvcxMCya",
                        "2V7kVs1TsZv7j38UTv4Dgbc6h258KS8eo5GZL9yhxCjv",
                        "9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC",
                        "2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi",
                    ];
                    _b = 0, goluts_1 = goluts;
                    _c.label = 3;
                case 3:
                    if (!(_b < goluts_1.length)) return [3 /*break*/, 8];
                    golut = goluts_1[_b];
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, connection.getAddressLookupTable(new web3_js_1.PublicKey(golut))];
                case 5:
                    test = (_c.sent())
                        .value;
                    // @ts-ignore
                    if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
                        goaccs.push(test);
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_3 = _c.sent();
                    console.log(err_3);
                    return [3 /*break*/, 7];
                case 7:
                    _b++;
                    return [3 /*break*/, 3];
                case 8:
                    doTheThing();
                    return [2 /*return*/];
            }
        });
    });
});
var tokens = JSON.parse(fs_1["default"].readFileSync("./tokens.json").toString());
var mod = 1;
var tokenbs = [];
function dothehorriblething(i) {
    return __awaiter(this, void 0, void 0, function () {
        var reserve, symbol, token_1, pubkey, amount, _i, pubkey_1, pk, solamis, amountToTrade, stuff_1, tokenb, aran_1, routes, tokenAccount, _a, _b, abc, routes2, _c, _d, bca, _e, preTransaction, mainTransaction, _f, pt, mp, instructions, _g, _h, _j, _k, _l, _m, _o, _p, messageV00, _q, transaction, result, txs, err_4, err_5, err_6, err_7, err_8;
        var _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    _s.trys.push([0, 32, , 33]);
                    i = 10;
                    reserve = market.reserves[i];
                    symbol = reserve.config.asset;
                    console.log(symbol + " ... ... ... mod: " + mod.toString());
                    token_1 = {
                        address: reserve.config.liquidityToken.mint,
                        decimals: reserve.config.liquidityToken.decimals,
                        symbol: symbol
                    };
                    return [4 /*yield*/, connection.getParsedTokenAccountsByOwner(new web3_js_1.PublicKey("HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV"), { mint: new web3_js_1.PublicKey(token_1.address) })];
                case 1:
                    pubkey = (_s.sent()).value;
                    amount = 0;
                    for (_i = 0, pubkey_1 = pubkey; _i < pubkey_1.length; _i++) {
                        pk = pubkey_1[_i];
                        if (parseFloat(pk.account.data.parsed.info.tokenAmount.uiAmount) >
                            amount) {
                            amount = parseInt(pk.account.data.parsed.info.tokenAmount.amount);
                        }
                    }
                    return [4 /*yield*/, prism.loadRoutes("So11111111111111111111111111111111111111112", token_1.address)];
                case 2:
                    _s.sent(); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
                    solamis = prism.getRoutes(0.000005);
                    amountToTrade = Math.floor(amount * (mod / 100));
                    stuff_1 = JSON.parse(fs_1["default"].readFileSync('./luts.json').toString());
                    tokenb = void 0;
                    aran_1 = Math.floor(Math.random() * (Object.keys(stuff_1).length));
                    if (Object.keys(stuff_1)[aran_1].indexOf(token_1.address)) {
                        tokenb = tokens.find(function (t) { return t.address === Object.keys(stuff_1)[aran_1].replace(token_1.address, ''); });
                    }
                    if (!tokenb) {
                        tokenb = tokenbs[Math.floor(Math.random() * tokenbs.length)];
                    }
                    return [4 /*yield*/, prism.loadRoutes(token_1.address, tokenb.address)];
                case 3:
                    _s.sent(); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
                    routes = prism.getRoutes(amountToTrade / Math.pow(10, token_1.decimals));
                    return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, // connection
                        wallet, // fee payer
                        new web3_js_1.PublicKey(reserve.config.liquidityToken.mint), wallet.publicKey, true // mint
                        )];
                case 4:
                    tokenAccount = (_s.sent()).address;
                    _a = 0, _b = [0, 1, 2, 3, 4];
                    _s.label = 5;
                case 5:
                    if (!(_a < _b.length)) return [3 /*break*/, 31];
                    abc = _b[_a];
                    if (!routes[abc]) return [3 /*break*/, 30];
                    _s.label = 6;
                case 6:
                    _s.trys.push([6, 29, , 30]);
                    return [4 /*yield*/, prism.loadRoutes(tokenb.address, token_1.address)];
                case 7:
                    _s.sent(); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
                    routes2 = prism.getRoutes(routes[abc].amountOut);
                    _c = 0, _d = [0, 1, 2, 3, 4];
                    _s.label = 8;
                case 8:
                    if (!(_c < _d.length)) return [3 /*break*/, 28];
                    bca = _d[_c];
                    _s.label = 9;
                case 9:
                    _s.trys.push([9, 26, , 27]);
                    if (!routes2[bca]) return [3 /*break*/, 25];
                    if (!(routes2[bca].amountOut > routes[abc].amountIn)) return [3 /*break*/, 25];
                    console.log("trading " +
                        (amountToTrade / Math.pow(10, token_1.decimals)).toString() +
                        " " +
                        token_1.symbol + ' solami fees to beat ' + solamis[0].amountOut.toString());
                    _s.label = 10;
                case 10:
                    _s.trys.push([10, 24, , 25]);
                    return [4 /*yield*/, prism.generateSwapTransactions(routes[abc])];
                case 11:
                    _e = _s.sent(), preTransaction = _e.preTransaction, mainTransaction = _e.mainTransaction;
                    return [4 /*yield*/, prism.generateSwapTransactions(routes2[bca])];
                case 12:
                    _f = _s.sent(), pt = _f.preTransaction, mp = _f.mainTransaction;
                    _g = [__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], preTransaction.instructions, true), pt.instructions, true), [
                            (0, solend_sdk_1.flashBorrowReserveLiquidityInstruction)(amountToTrade, new web3_js_1.PublicKey(reserve.config.liquidityAddress), tokenAccount, new web3_js_1.PublicKey(reserve.config.address), new web3_js_1.PublicKey(market.config.address), SOLEND_PRODUCTION_PROGRAM_ID)
                        ], false), mainTransaction.instructions, true), mp.instructions, true)];
                    _h = [(0, flashRepayReserveLiquidity_1.flashRepayReserveLiquidityInstruction)(amountToTrade, preTransaction.instructions.length + pt.instructions.length, tokenAccount, new web3_js_1.PublicKey(reserve.config.liquidityAddress), new web3_js_1.PublicKey(reserve.config.liquidityAddress), tokenAccount, new web3_js_1.PublicKey(reserve.config.address), new web3_js_1.PublicKey(market.config.address), wallet.publicKey, SOLEND_PRODUCTION_PROGRAM_ID, new web3_js_1.PublicKey(jaregms[token_1.symbol]), new web3_js_1.PublicKey(reserve.config.liquidityToken.mint))];
                    _j = spl_token_2.createTransferInstruction;
                    _k = [tokenAccount,
                        new web3_js_1.PublicKey(jaregms[token_1.symbol]),
                        wallet.publicKey];
                    return [4 /*yield*/, connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                            mint: new web3_js_1.PublicKey(reserve.config.liquidityToken.mint)
                        })];
                case 13:
                    instructions = __spreadArray.apply(void 0, _g.concat([_h.concat([
                            _j.apply(void 0, _k.concat([// from's owner
                                (_s.sent()).value[0].account.data.parsed.info.tokenAmount.amount + Math.ceil(solamis[0].amountOut / 2 * Math.pow(10, token_1.decimals))]))
                        ]), false]));
                    if (!Object.keys(tgoaccs).includes(token_1.symbol)) {
                        tgoaccs[token_1.symbol] = [];
                    }
                    if (!(tgoaccs[token_1.symbol].length == 0)) return [3 /*break*/, 15];
                    _l = tgoaccs;
                    _m = token_1.symbol;
                    return [4 /*yield*/, findLuts(token_1.address)];
                case 14:
                    _l[_m] = _s.sent();
                    _s.label = 15;
                case 15:
                    if (!Object.keys(tgoaccs).includes(tokenb.symbol)) {
                        tgoaccs[tokenb.symbol] = [];
                    }
                    if (!(tgoaccs[tokenb.symbol].length == 0)) return [3 /*break*/, 17];
                    _o = tgoaccs;
                    _p = tokenb.symbol;
                    return [4 /*yield*/, findLuts(tokenb.address)];
                case 16:
                    _o[_p] = _s.sent();
                    _s.label = 17;
                case 17:
                    _q = web3_js_1.TransactionMessage.bind;
                    _r = {
                        payerKey: wallet.publicKey
                    };
                    return [4 /*yield*/, connection.getLatestBlockhash()];
                case 18: return [4 /*yield*/, // @ts-ignore
                    (_s.sent()).blockhash];
                case 19:
                    messageV00 = new (_q.apply(web3_js_1.TransactionMessage, [void 0, (_r.recentBlockhash = _s.sent(),
                            _r.instructions = instructions,
                            _r)]))().compileToV0Message(__spreadArray(__spreadArray(__spreadArray([], goaccs, true), tgoaccs[token_1.symbol], true), tgoaccs[tokenb.symbol], true));
                    transaction = new web3_js_1.VersionedTransaction(messageV00);
                    result = void 0;
                    _s.label = 20;
                case 20:
                    _s.trys.push([20, 22, , 23]);
                    transaction.sign([wallet]);
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, 
                        // @ts-ignore
                        transaction, { skipPreflight: false }, { skipPreflight: false })];
                case 21:
                    result = _s.sent();
                    console.log("tx: https://solscan.io/tx/" + result);
                    txs = fs_1["default"].readFileSync('./txs.txt').toString();
                    txs += '\nhttps://solscan.io/tx/' + result;
                    fs_1["default"].writeFileSync('txs.txt', txs);
                    return [3 /*break*/, 23];
                case 22:
                    err_4 = _s.sent();
                    console.log(err_4);
                    return [3 /*break*/, 23];
                case 23:
                    if (result != undefined) {
                        mod = mod * 10;
                    }
                    return [3 /*break*/, 25];
                case 24:
                    err_5 = _s.sent();
                    console.log(err_5);
                    return [3 /*break*/, 25];
                case 25: return [3 /*break*/, 27];
                case 26:
                    err_6 = _s.sent();
                    console.log(err_6);
                    return [3 /*break*/, 27];
                case 27:
                    _c++;
                    return [3 /*break*/, 8];
                case 28: return [3 /*break*/, 30];
                case 29:
                    err_7 = _s.sent();
                    console.log(err_7);
                    return [3 /*break*/, 30];
                case 30:
                    _a++;
                    return [3 /*break*/, 5];
                case 31: return [3 /*break*/, 33];
                case 32:
                    err_8 = _s.sent();
                    console.log(err_8);
                    return [3 /*break*/, 33];
                case 33: return [2 /*return*/];
            }
        });
    });
}
function doTheThing() {
    return __awaiter(this, void 0, void 0, function () {
        var a, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //    let start = new Date().getTime() / 1000;
                    if (mod < 0.00000001) {
                        mod = 100;
                    }
                    a = 2;
                    i = 2;
                    _a.label = 1;
                case 1:
                    if (!(i <= 13)) return [3 /*break*/, 4];
                    if (!(i != 1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, dothehorriblething(a)];
                case 2:
                    _a.sent();
                    a++;
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    setTimeout(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                doTheThing();
                                return [2 /*return*/];
                            });
                        });
                    }, 1000);
                    mod = mod / 10;
                    return [2 /*return*/];
            }
        });
    });
}
