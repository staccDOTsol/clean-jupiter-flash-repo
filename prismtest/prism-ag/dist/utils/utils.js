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
exports.getGlobalStats = exports.getUserHistoty = exports.unKnownSerumMarket = exports.fetchUserAccountsAndTokenList = exports.fetchUserAccounts = exports.unwrapWSolAccounts = exports.closeOpenOrdersForUser = exports.sendCustomTransaction = exports.fetchUserOpenOrders = exports.findCoinFrom = exports.coinInfo = exports.getBigNumber = exports.createAmmAuthority = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../types/types");
const bn_js_1 = __importDefault(require("bn.js"));
const serum_1 = require("@project-serum/serum");
const stats_1 = require("./stats");
const axios_1 = __importDefault(require("axios"));
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
function createAmmAuthority(programId) {
    return (0, pubkey_1.findProgramAddressSync)([new Uint8Array(Buffer.from('amm authority'.replace('\u00A0', ' '), 'utf-8'))], programId)[0];
}
exports.createAmmAuthority = createAmmAuthority;
function getBigNumber(num) {
    return num === undefined || num === null ? 0 : parseFloat(num.toString());
}
exports.getBigNumber = getBigNumber;
function coinInfo(coinInfo) {
    return {
        symbol: coinInfo.symbol,
        decimals: coinInfo.decimals,
        mintAddress: coinInfo.symbol === "SOL" ? "So11111111111111111111111111111111111111112" : coinInfo.address,
        coingeckoId: (coinInfo.extensions && coinInfo.extensions.coingeckoId) ? coinInfo.extensions.coingeckoId : null,
    };
}
exports.coinInfo = coinInfo;
function findCoinFrom(tokenList, symbolOrMint) {
    if (!tokenList)
        return null;
    for (let i = 0; i < tokenList.length; i++)
        if (tokenList[i].symbol === symbolOrMint || tokenList[i].address == symbolOrMint)
            return Object.assign(Object.assign({}, coinInfo(tokenList[i])), tokenList[i]);
    return null;
}
exports.findCoinFrom = findCoinFrom;
function fetchUserOpenOrders(tokenList, connection, publicKey, program) {
    return __awaiter(this, void 0, void 0, function* () {
        let rawOpenOrdersAccounts = yield serum_1.OpenOrders.findForOwner(connection, publicKey, program).catch((e) => { return []; });
        for (let i = 0; i < rawOpenOrdersAccounts.length; i++) {
            let market = yield serum_1.Market.load(connection, rawOpenOrdersAccounts[i].market, undefined, program);
            let coinA = findCoinFrom(tokenList.tokens, market.baseMintAddress.toBase58());
            let coinB = findCoinFrom(tokenList.tokens, market.quoteMintAddress.toBase58());
            rawOpenOrdersAccounts[i] = Object.assign(Object.assign({}, rawOpenOrdersAccounts[i]), { base: market.baseMintAddress, quote: market.quoteMintAddress, coinA: coinA ? coinA.symbol : null, coinB: coinB ? coinB.symbol : null });
        }
        return rawOpenOrdersAccounts;
    });
}
exports.fetchUserOpenOrders = fetchUserOpenOrders;
function sendCustomTransaction(connection, wallet, allInstructions) {
    return __awaiter(this, void 0, void 0, function* () {
        let allTransactions = [];
        let { blockhash } = yield connection.getRecentBlockhash();
        for (let i = 0; i < allInstructions.length; i++) {
            let transaction = new web3_js_1.Transaction();
            transaction.instructions = allInstructions[i];
            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = blockhash;
            allTransactions.push(transaction);
        }
        allTransactions = yield wallet.signAllTransactions(allTransactions);
        let promises = [];
        for (let i = 0; i < allTransactions.length; i++)
            promises.push(connection.sendRawTransaction(allTransactions[i].serialize(), { skipPreflight: true }));
        return yield Promise.all(promises);
    });
}
exports.sendCustomTransaction = sendCustomTransaction;
function closeOpenOrdersForUser(prism, openOrders) {
    return __awaiter(this, void 0, void 0, function* () {
        let allInstructions = [];
        let instructions = [];
        for (let i = 0; i < openOrders.length; i++) {
            let data = Buffer.from([0, 14, 0, 0, 0]);
            let clsoeTx = new web3_js_1.TransactionInstruction({
                keys: [
                    {
                        pubkey: openOrders[i].address,
                        isSigner: false,
                        isWritable: true,
                    },
                    {
                        pubkey: prism.user.publicKey,
                        isSigner: true,
                        isWritable: true,
                    },
                    {
                        pubkey: prism.user.publicKey,
                        isSigner: true,
                        isWritable: true,
                    },
                    {
                        pubkey: openOrders[i].market,
                        isSigner: false,
                        isWritable: false,
                    },
                ],
                programId: openOrders[i]._programId,
                data,
            });
            instructions.push(clsoeTx);
            if (instructions.length == 7) {
                allInstructions.push(instructions);
                instructions = [];
            }
        }
        if (instructions.length > 0)
            allInstructions.push(instructions);
        return yield sendCustomTransaction(prism.connection, prism.user, allInstructions);
    });
}
exports.closeOpenOrdersForUser = closeOpenOrdersForUser;
function unwrapWSolAccounts(prism) {
    return __awaiter(this, void 0, void 0, function* () {
        let allInstructions = [];
        let instructions = [];
        for (let i = 0; i < prism.userAccounts.length; i++)
            if (prism.userAccounts[i].isWrapped) {
                instructions.push(serum_1.TokenInstructions.closeAccount({
                    source: new web3_js_1.PublicKey(prism.userAccounts[i].address),
                    destination: prism.user.publicKey,
                    owner: prism.user.publicKey,
                }));
                if (instructions.length == 7) {
                    allInstructions.push(instructions);
                    instructions = [];
                }
            }
        if (instructions.length > 0)
            allInstructions.push(instructions);
        return yield sendCustomTransaction(prism.connection, prism.user, allInstructions);
    });
}
exports.unwrapWSolAccounts = unwrapWSolAccounts;
function fetchUserAccounts(tokenList, connection, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let accounts = [];
        if (!publicKey)
            return [];
        accounts.push({
            address: publicKey.toBase58(),
            balance: (yield connection.getBalance(publicKey, "processed").catch(() => 0)) / 10 ** 9,
            mint: new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"),
            symbol: "SOL",
            coingeckoId: "solana",
            usdValue: 0,
            isWrapped: false,
            tokenInfo: Object.assign(Object.assign({}, findCoinFrom(tokenList.tokens, "SOL")), { name: "Solana" })
        });
        let response = yield connection.getTokenAccountsByOwner(publicKey, { programId: new web3_js_1.PublicKey(types_1.TOKEN_PROGRAM_ID) }, "recent").catch((e) => { return { value: [] }; });
        for (let i = 0; i < response.value.length; i++) {
            let mintPubkey = new web3_js_1.PublicKey(response.value[i].account.data.slice(0, 32)).toBase58();
            let token = findCoinFrom(tokenList.tokens, mintPubkey);
            if (!token)
                continue;
            let amountString = new bn_js_1.default(response.value[i].account.data.slice(64, 72), "le").toString();
            accounts.push({
                symbol: token.symbol,
                address: response.value[i].pubkey.toBase58(),
                mint: mintPubkey,
                balance: parseInt(amountString) / 10 ** token.decimals,
                coingeckoId: token.coingeckoId,
                usdValue: 0,
                isWrapped: (token.symbol.toUpperCase() == "SOL") ? true : false,
                tokenInfo: token,
            });
        }
        return accounts;
    });
}
exports.fetchUserAccounts = fetchUserAccounts;
function fetchUserAccountsAndTokenList(tokenList, connection, publicKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let accounts = yield fetchUserAccounts(tokenList, connection, publicKey);
        // let userOpenOrders = await fetchUserOpenOrders(connection, publicKey);
        return {
            accounts: accounts,
            // userOpenOrders: userOpenOrders,
            tokenList: tokenList
        };
    });
}
exports.fetchUserAccountsAndTokenList = fetchUserAccountsAndTokenList;
function unKnownSerumMarket(mintA, mintB, knownPairs, option) {
    let known = knownPairs.find((element) => (element.pair_id.split("-")[0] == mintA &&
        element.pair_id.split("-")[1] == mintB) || (element.pair_id.split("-")[0] == mintB &&
        element.pair_id.split("-")[1] == mintA));
    if (known && known.market && option.provider == "serum" &&
        known.market != option.ownAddress.toString())
        return true;
    return false;
}
exports.unKnownSerumMarket = unKnownSerumMarket;
function getUserHistoty(pubkey) {
    return __awaiter(this, void 0, void 0, function* () {
        let params = {
            "wallet": pubkey,
            days: -1
        };
        let response = yield axios_1.default.post(stats_1.TRADE_HISTORY_API, params, { headers: { "content-type": "application/json" } });
        return response.data;
    });
}
exports.getUserHistoty = getUserHistoty;
const getGlobalStats = () => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield axios_1.default.get(stats_1.GLOBAL_STATS_API);
    return response.data;
});
exports.getGlobalStats = getGlobalStats;
