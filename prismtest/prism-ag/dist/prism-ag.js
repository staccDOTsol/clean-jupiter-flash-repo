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
exports.Prism = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("./types/types");
const utils_1 = require("./utils/utils");
const axios_1 = __importDefault(require("axios"));
const liquidityProviders_1 = require("./liquidity/providers/liquidityProviders");
const liquidityInfos_1 = require("./liquidity/infos/liquidityInfos");
const aggregator_1 = require("./aggregator/aggregator");
const swap_1 = require("./swap/swap");
const anchor_1 = require("@project-serum/anchor");
class Prism {
    constructor(connection, user, publicKey, settings, userAccounts, tokenList, liquidityProviders) {
        this.connection = connection;
        this.user = user;
        this.publicKey = publicKey;
        this.settings = settings;
        this.userAccounts = userAccounts;
        this.tokenList = tokenList;
        this.liquidityProviders = liquidityProviders;
        this.userOpenOrdersSerum = null;
        this.userOpenOrdersOpenBook = null;
        this.lastFromCoin = null;
        this.lastToCoin = null;
        (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, publicKey, new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3)).then(result => {
            this.userOpenOrdersSerum = result;
        });
        (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, publicKey, new web3_js_1.PublicKey(types_1.OPENBOOK_PROGRAM_ID)).then(result => {
            this.userOpenOrdersOpenBook = result;
        });
    }
    static init(params, disableCache = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        return __awaiter(this, void 0, void 0, function* () {
            let settings = {
                owner: {
                    publicKey: new web3_js_1.PublicKey(types_1.PRISM_OWNER),
                    fee: 0
                },
                host: params.host ? {
                    publicKey: new web3_js_1.PublicKey(params.host.publicKey),
                    fee: params.host.fee,
                } : {
                    publicKey: new web3_js_1.PublicKey(types_1.PRISM_OWNER),
                    fee: 0,
                },
                slippage: params.slippage ? params.slippage : 0.5,
                liqProviders: {
                    serum: ((_a = params.liqProviders) === null || _a === void 0 ? void 0 : _a.serum) != undefined ? (_b = params.liqProviders) === null || _b === void 0 ? void 0 : _b.serum : true,
                    saber: ((_c = params.liqProviders) === null || _c === void 0 ? void 0 : _c.saber) != undefined ? (_d = params.liqProviders) === null || _d === void 0 ? void 0 : _d.saber : true,
                    raydium: ((_e = params.liqProviders) === null || _e === void 0 ? void 0 : _e.raydium) != undefined ? (_f = params.liqProviders) === null || _f === void 0 ? void 0 : _f.raydium : true,
                    aldrin: ((_g = params.liqProviders) === null || _g === void 0 ? void 0 : _g.aldrin) != undefined ? (_h = params.liqProviders) === null || _h === void 0 ? void 0 : _h.aldrin : true,
                    orca: ((_j = params.liqProviders) === null || _j === void 0 ? void 0 : _j.orca) != undefined ? (_k = params.liqProviders) === null || _k === void 0 ? void 0 : _k.orca : true,
                    lifinity: ((_l = params.liqProviders) === null || _l === void 0 ? void 0 : _l.lifinity) != undefined ? (_m = params.liqProviders) === null || _m === void 0 ? void 0 : _m.lifinity : true,
                    symmetry: ((_o = params.liqProviders) === null || _o === void 0 ? void 0 : _o.symmetry) != undefined ? (_p = params.liqProviders) === null || _p === void 0 ? void 0 : _p.symmetry : true,
                    cropper: ((_q = params.liqProviders) === null || _q === void 0 ? void 0 : _q.cropper) != undefined ? (_r = params.liqProviders) === null || _r === void 0 ? void 0 : _r.cropper : true,
                    sencha: ((_s = params.liqProviders) === null || _s === void 0 ? void 0 : _s.sencha) != undefined ? (_t = params.liqProviders) === null || _t === void 0 ? void 0 : _t.sencha : true,
                    saros: ((_u = params.liqProviders) === null || _u === void 0 ? void 0 : _u.saros) != undefined ? (_v = params.liqProviders) === null || _v === void 0 ? void 0 : _v.saros : true,
                    step: ((_w = params.liqProviders) === null || _w === void 0 ? void 0 : _w.step) != undefined ? (_x = params.liqProviders) === null || _x === void 0 ? void 0 : _x.step : true,
                    penguin: ((_y = params.liqProviders) === null || _y === void 0 ? void 0 : _y.penguin) != undefined ? (_z = params.liqProviders) === null || _z === void 0 ? void 0 : _z.penguin : true,
                    mercurial: ((_0 = params.liqProviders) === null || _0 === void 0 ? void 0 : _0.mercurial) != undefined ? (_1 = params.liqProviders) === null || _1 === void 0 ? void 0 : _1.mercurial : true,
                    stepn: ((_2 = params.liqProviders) === null || _2 === void 0 ? void 0 : _2.stepn) != undefined ? (_3 = params.liqProviders) === null || _3 === void 0 ? void 0 : _3.stepn : true,
                    marinade: ((_4 = params.liqProviders) === null || _4 === void 0 ? void 0 : _4.marinade) != undefined ? (_5 = params.liqProviders) === null || _5 === void 0 ? void 0 : _5.marinade : true,
                    cykura: ((_6 = params.liqProviders) === null || _6 === void 0 ? void 0 : _6.cykura) != undefined ? (_7 = params.liqProviders) === null || _7 === void 0 ? void 0 : _7.cykura : true,
                    gooseFX: ((_8 = params.liqProviders) === null || _8 === void 0 ? void 0 : _8.gooseFX) != undefined ? (_9 = params.liqProviders) === null || _9 === void 0 ? void 0 : _9.gooseFX : true,
                    openbook: ((_10 = params.liqProviders) === null || _10 === void 0 ? void 0 : _10.openbook) != undefined ? (_11 = params.liqProviders) === null || _11 === void 0 ? void 0 : _11.openbook : true,
                    balansol: ((_12 = params.liqProviders) === null || _12 === void 0 ? void 0 : _12.balansol) != undefined ? (_13 = params.liqProviders) === null || _13 === void 0 ? void 0 : _13.balansol : true,
                }
            };
            let connection = params.connection ?
                params.connection :
                new web3_js_1.Connection(types_1.ENDPOINT);
            let user = params.user;
            //@ts-ignore
            let publicKey = params.user;
            //@ts-ignore
            if (user && user.publicKey) {
                //@ts-ignore
                publicKey = user.publicKey;
                //@ts-ignore
                try {
                    user = new anchor_1.Wallet(user);
                }
                catch (_14) { }
            }
            let userAccountsPromise = params.tokenList ?
                (0, utils_1.fetchUserAccountsAndTokenList)(params.tokenList, connection, publicKey) :
                axios_1.default.get(types_1.TOKEN_LIST_URI).then(result => (0, utils_1.fetchUserAccountsAndTokenList)(result.data, connection, publicKey));
            let liquidityProvidersPromise = yield (0, liquidityProviders_1.loadLiquidityProviders)(connection, settings.liqProviders, disableCache);
            return yield Promise.all([
                liquidityProvidersPromise,
                userAccountsPromise,
            ]).then(results => {
                return new Prism(connection, user, publicKey, settings, results[1].accounts, results[1].tokenList, results[0]);
            });
        });
    }
    static getCacheData(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, liquidityProviders_1.getCacheData)(connection);
        });
    }
    setSigner(user) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            try {
                user = new anchor_1.Wallet(user);
            }
            catch (_a) { }
            let walletChange = true;
            //@ts-ignore
            try {
                if (user.publicKey.equals(this.user))
                    walletChange = false;
            }
            catch (_b) { }
            //@ts-ignore
            try {
                if (user.publicKey.equals(this.user.publicKey))
                    walletChange = false;
            }
            catch (_c) { }
            if (walletChange) {
                this.publicKey = user.publicKey;
                this.userAccounts = yield (0, utils_1.fetchUserAccounts)(this.tokenList, this.connection, this.publicKey);
                this.userOpenOrdersSerum = null;
                this.userOpenOrdersOpenBook = null;
                (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, 
                //@ts-ignore
                this.publicKey, new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3)).then(result => {
                    this.userOpenOrdersSerum = result;
                });
                (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, 
                //@ts-ignore
                this.publicKey, new web3_js_1.PublicKey(types_1.OPENBOOK_PROGRAM_ID)).then(result => {
                    this.userOpenOrdersOpenBook = result;
                });
            }
            this.user = user;
        });
    }
    setSlippage(slippage) {
        this.settings = Object.assign(Object.assign({}, this.settings), { slippage: slippage });
    }
    setLiqProviders(liqProviders) {
        this.settings.liqProviders = {
            serum: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.serum) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.serum : true,
            saber: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.saber) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.saber : true,
            raydium: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.raydium) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.raydium : true,
            aldrin: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.aldrin) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.aldrin : true,
            orca: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.orca) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.orca : true,
            lifinity: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.lifinity) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.lifinity : true,
            symmetry: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.symmetry) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.symmetry : true,
            cropper: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.cropper) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.cropper : true,
            sencha: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.sencha) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.sencha : true,
            saros: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.saros) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.saros : true,
            step: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.step) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.step : true,
            penguin: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.penguin) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.penguin : true,
            mercurial: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.mercurial) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.mercurial : true,
            stepn: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.stepn) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.stepn : true,
            marinade: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.marinade) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.marinade : true,
            cykura: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.cykura) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.cykura : true,
            gooseFX: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.gooseFX) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.gooseFX : true,
            openbook: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.openbook) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.openbook : true,
            balansol: (liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.balansol) != undefined ? liqProviders === null || liqProviders === void 0 ? void 0 : liqProviders.balansol : true,
        };
    }
    getUserAccounts() {
        return this.userAccounts;
    }
    getUserOpenOrdersSerum() {
        return this.userOpenOrdersSerum || [];
    }
    getUserOpenOrdersOpenbook() {
        return this.userOpenOrdersOpenBook || [];
    }
    closeOpenOrders(openOrders) {
        return __awaiter(this, void 0, void 0, function* () {
            let txIds = null;
            yield (0, utils_1.closeOpenOrdersForUser)(this, openOrders)
                .catch(() => { })
                .then(result => txIds = result);
            yield Promise.all([
                (0, utils_1.fetchUserAccounts)(this.tokenList, this.connection, 
                //@ts-ignore
                this.user.publicKey),
                (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, 
                //@ts-ignore
                this.user.publicKey, new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3)),
                (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, 
                //@ts-ignore
                this.user.publicKey, new web3_js_1.PublicKey(types_1.OPENBOOK_PROGRAM_ID))
            ]).then(results => {
                this.userAccounts = results[0];
                this.userOpenOrdersSerum = results[1];
                this.userOpenOrdersOpenBook = results[2];
            });
            return txIds;
        });
    }
    unwrapWSolAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            let txIds = null;
            yield (0, utils_1.unwrapWSolAccounts)(this)
                .catch(() => { })
                .then(result => txIds = result);
            yield (0, utils_1.fetchUserAccounts)(this.tokenList, this.connection, 
            //@ts-ignore
            this.user.publicKey).then(result => {
                this.userAccounts = result;
            });
            return txIds;
        });
    }
    static loadPrismStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.getGlobalStats)().catch(() => null);
        });
    }
    loadPrismStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.getGlobalStats)().catch(() => null);
        });
    }
    static loadUserTradeHistory(publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.getUserHistoty)(publicKey).catch(() => null);
        });
    }
    loadUserTradeHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.getUserHistoty)(
            //@ts-ignore
            this.user.publicKey).catch(() => null);
        });
    }
    loadRoutes(from, to, oldData, direct = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fromCoin = (0, utils_1.findCoinFrom)(this.tokenList.tokens, from);
            this.toCoin = (0, utils_1.findCoinFrom)(this.tokenList.tokens, to);
            let tokenMap = {};
            for (let i = 0; i < this.tokenList.tokens.length; i++) {
                tokenMap[this.tokenList.tokens[i].address] = Object.assign(Object.assign({}, (0, utils_1.coinInfo)(this.tokenList.tokens[i])), this.tokenList.tokens[i]);
            }
            if (this.lastFromCoin && this.lastToCoin && this.fromCoin.address == this.lastToCoin.address && this.toCoin.address == this.lastFromCoin.address) {
                this.lastFromCoin = this.fromCoin;
                this.lastToCoin = this.toCoin;
                this.liquidityInfos.routes = yield (0, liquidityInfos_1.loadLiquidityInfos)(this.fromCoin, this.toCoin,oldData, this.liquidityProviders,  this.connection, tokenMap, direct, true);
                return;
            }
            this.lastFromCoin = this.fromCoin;
            this.lastToCoin = this.toCoin;
            this.liquidityInfos = yield (0, liquidityInfos_1.loadLiquidityInfos)(this.fromCoin, this.toCoin, oldData,this.liquidityProviders, this.connection, tokenMap, direct, false);
        return this.liquidityInfos
        });
        
    }
    getRoutes(amount) {
        return (0, aggregator_1.findRoutes)(this.fromCoin, this.toCoin, amount, this.liquidityInfos, this.liquidityProviders, this.settings);
    }
    generateSwapTransactions(route) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield (0, swap_1.generateTransactions)(this, route).catch(() => null);
            return {
                preTransaction: result.preTransaction,
                preSigners: result.preSigners,
                mainTransaction: result.mainTransaction,
                postTransaction: result.postTransaction,
            };
        });
    }
    generateSymmetryTransaction(route, fromTokenAccount, toTokenAccount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, swap_1.generateSymmetryTransaction)(this, route, fromTokenAccount, toTokenAccount);
        });
    }
    swap(route) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            if (!this.user || !this.user.publicKey)
                throw new Error("Keypair or Wallet not provided. See setSigner function.");
            let result = yield (0, swap_1.executeSwap)(this, route).catch((e) => { console.log(e); return undefined; });
            (0, utils_1.fetchUserAccounts)(this.tokenList, this.connection, 
            //@ts-ignore
            this.user.publicKey).then(result => {
                this.userAccounts = result;
            });
            (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, 
            //@ts-ignore
            this.user.publicKey, new web3_js_1.PublicKey(types_1.SERUM_PROGRAM_ID_V3)).then(result => {
                this.userOpenOrdersSerum = result;
            });
            (0, utils_1.fetchUserOpenOrders)(this.tokenList, this.connection, 
            //@ts-ignore
            this.user.publicKey, new web3_js_1.PublicKey(types_1.OPENBOOK_PROGRAM_ID)).then(result => {
                this.userOpenOrdersOpenBook = result;
            });
            return result;
        });
    }
    /**
    * @deprecated Swap function already confirms transaction
    */
    confirmSwap(result) {
        return __awaiter(this, void 0, void 0, function* () {
            return result.response;
        });
    }
}
exports.Prism = Prism;
