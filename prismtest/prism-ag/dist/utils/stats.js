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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.en = exports.SAVE_USER_TRADE = exports.GLOBAL_STATS_API = exports.TRADE_HISTORY_API = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
exports.TRADE_HISTORY_API = "https://mo5mnc5gt4.execute-api.eu-central-1.amazonaws.com/prod/user-stats/tr-history";
exports.GLOBAL_STATS_API = "https://mo5mnc5gt4.execute-api.eu-central-1.amazonaws.com/prod/prism-stats";
exports.SAVE_USER_TRADE = "https://mo5mnc5gt4.execute-api.eu-central-1.amazonaws.com/prod/transaction_queue";
function en(input, ps, callback) {
    var m = crypto.createHash('md5');
    m.update(ps);
    var key = m.digest('hex');
    m = crypto.createHash('md5');
    m.update(ps + key);
    var iv = m.digest('hex');
    var data = Buffer.from(input, 'utf8').toString('binary');
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv.slice(0, 16));
    var enc = cipher.update(data, 'utf8', 'binary') + cipher.final('binary');
    var en = Buffer.from(enc, 'binary').toString('base64');
    callback(en);
}
exports.en = en;
;
function getStats(settings, user, route, result, toFees, midFees, fromT, midT, toT) {
    let { fromCoin, midCoin, toCoin } = route.routeData;
    let feesAccounts = [];
    feesAccounts.push({ is_host: false, mint: toCoin.mintAddress, account: toFees.owner.toBase58() });
    if (!settings.host.publicKey.equals(settings.owner.publicKey))
        feesAccounts.push({ is_host: true, mint: toCoin.mintAddress, account: toFees.host.toBase58() });
    if (midCoin) {
        feesAccounts.push({ is_host: false, mint: midCoin.mintAddress, account: midFees.owner.toBase58() });
        if (!settings.host.publicKey.equals(settings.owner.publicKey))
            feesAccounts.push({ is_host: true, mint: midCoin.mintAddress, account: midFees.host.toBase58() });
    }
    let req = {
        "owner": user.toBase58(),
        "host": settings.host ? settings.host.publicKey.toBase58() : null,
        "from_account": fromT.toBase58(),
        "from_mint": fromCoin.mintAddress,
        "from_amount": route.amountIn,
        "type": route.type,
        "mid_account": midT ? midT.toBase58() : null,
        "mid_mint": midCoin ? midCoin.mintAddress : null,
        "mid_amount": route.amountMid ? route.amountMid : 0,
        "to_account": toT.toBase58(),
        "to_mint": toCoin.mintAddress,
        "to_amount": route.amountOut,
        "sig": result.txId,
        "fees": feesAccounts,
        "routes": route.providers,
        "split": route.split,
        "message": route.amountIn.toFixed(6) + " " + route.from + " -> " +
            (route.amountMid ? (route.amountMid.toFixed(6) + " " + route.mid + " -> ") : "") +
            route.amountOut.toFixed(6) + " " + route.to,
    };
    en(JSON.stringify(req), 'QkSngokpuQCnapwSwfuo8T5wUcHsnhNk', function (ena) {
        axios_1.default.post(exports.SAVE_USER_TRADE, { data: ena }, { headers: { "content-type": "application/json" } });
    });
    return req;
}
exports.getStats = getStats;
