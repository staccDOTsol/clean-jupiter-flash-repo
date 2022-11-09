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
        while (_) try {
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
exports.__esModule = true;
var bs58_1 = require("bs58");
var web3_js_1 = require("@solana/web3.js");
var fs_1 = require("fs");
var web3_js_2 = require("@solana/web3.js");
// @ts-ignore
var SIGNER_WALLET = web3_js_1.Keypair.fromSecretKey(
// @ts-ignore
bs58_1["default"].decode(process.env.SOLANA_WALLET_PRIVATE_KEY));
//const LOOKUP_TABLE_ADDRESS = new PublicKey(""); // We will add this later
// @ts-ignore
var connection = new web3_js_1.Connection("https://api.mainnet-beta.solana.com");
function createAndSendV0Tx(txInstructions) {
    return __awaiter(this, void 0, void 0, function () {
        var latestBlockhash, messageV0, transaction, txid, confirmation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getLatestBlockhash('finalized')];
                case 1:
                    latestBlockhash = _a.sent();
                    console.log("   ✅ - Fetched latest blockhash. Last valid height:", latestBlockhash.lastValidBlockHeight);
                    messageV0 = new web3_js_1.TransactionMessage({
                        payerKey: SIGNER_WALLET.publicKey,
                        recentBlockhash: latestBlockhash.blockhash,
                        instructions: txInstructions
                    }).compileToV0Message();
                    console.log("   ✅ - Compiled transaction message");
                    transaction = new web3_js_1.VersionedTransaction(messageV0);
                    // Step 3 - Sign your transaction with the required `Signers`
                    transaction.sign([SIGNER_WALLET]);
                    console.log("   ✅ - Transaction Signed");
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, { maxRetries: 5 })];
                case 2:
                    txid = _a.sent();
                    console.log("   ✅ - Transaction sent to network");
                    return [4 /*yield*/, connection.confirmTransaction({
                            signature: txid,
                            blockhash: latestBlockhash.blockhash,
                            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
                        })];
                case 3:
                    confirmation = _a.sent();
                    if (confirmation.value.err) {
                        throw new Error("   ❌ - Transaction not confirmed.");
                    }
                    console.log('🎉 Transaction succesfully confirmed!', '\n', "https://explorer.solana.com/tx/".concat(txid, "?cluster=devnet"));
                    return [2 /*return*/];
            }
        });
    });
}
setTimeout(function () {
    return __awaiter(this, void 0, void 0, function () {
        var configs, addies, add, abc, which, LOOKUP_TABLE_ADDRESS, units, tinsts, modifyComputeUnits, addPriorityFee, ata2, hmms, keys, _i, hmms_1, ix, addAddressesInstruction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    configs = JSON.parse(fs_1["default"].readFileSync("configs.json").toString());
                    addies = [];
                    add = [];
                    abc = 0;
                    which = -1;
                    LOOKUP_TABLE_ADDRESS = new web3_js_1.PublicKey("9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC");
                    units = 366642;
                    tinsts = [];
                    modifyComputeUnits = web3_js_2.ComputeBudgetProgram.setComputeUnitLimit({
                        //234907
                        units: units
                    });
                    addPriorityFee = web3_js_2.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: Math.floor(units / 1000000 * 50)
                    });
                    tinsts.push(modifyComputeUnits);
                    tinsts.push(addPriorityFee);
                    ata2 = new web3_js_1.Keypair();
                    hmms = ["JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB", "AGGZ2djPDEvrbgiBTV3P8UoB8Zf1kGawkWd2eu553o44",
                        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                        "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
                        "SysvarC1ock11111111111111111111111111111111", "11111111111111111111111111111111",
                        ,
                        '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin', '6MLxLqiXaaSUpkgMnWDTuejNZEz3kE7k2woyHGVFw319',
                        'EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S', 'CTMAxxk34HjKWxQ3QLZK1HpaLXmBveao3ESePXbiyfzh', 'AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6',
                        "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP", 'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ', '2KehYt3KsEQR53jYcxjbQp2d2kCp4AkuQW68atufRwSr',
                        'MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky', 'SCHAtsf8mbjyjiv4LkhLKutTf6JnZAbdJKFkXQNMFHZ', 'SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr',
                        'SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1', 'PSwapMdSai8tjrEXcxFeQth87xC4rRsa4VA5mhGhXkP', 'cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8',
                        'Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j', 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD', '7WduLbRfYhTJktjLw5FDEyrqoEv61aTTCuGAetgLjzN5',
                        "3qgS5KYBTFJ6Lt8GujDEQLcgfLPSnFZ5VFMrxoes7rXs", '5EUiihMbweSuBAFgU5KR7X1x8TJapNRaf9AyAXk73vC8', 'HXgqkq5hn6QxrtJmtPW7igf7G4mrxbqS5c8NQybnxYi2',
                        'BLBYiq48WcLQ5SxiftyKmPtmsZPUBEnDEjqEnKGAR4zx',
                        '3hsU1VgsBgBgz5jWiqdw9RfGU6TpWdCmdah1oi4kF3Tq', 'DyDdJM9KVsvosfXbcHDp4pRpmbMHkRq3pcarBykPy4ir', 'DBsMwKfeoUHhxMi9x6wd2AsT12UwUCssjNbUzu1aKgqj',
                        '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC', 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', 'UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q', '7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE', 'EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL', 'Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN', '3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM', '8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ'];
                    keys = [];
                    for (_i = 0, hmms_1 = hmms; _i < hmms_1.length; _i++) {
                        ix = hmms_1[_i];
                        keys.push(new web3_js_1.PublicKey(ix));
                    }
                    console.log(keys);
                    addAddressesInstruction = web3_js_1.AddressLookupTableProgram.extendLookupTable({
                        payer: SIGNER_WALLET.publicKey,
                        authority: SIGNER_WALLET.publicKey,
                        lookupTable: LOOKUP_TABLE_ADDRESS,
                        addresses: keys
                    });
                    // Step 2 - Generate a transaction and send it to the network
                    return [4 /*yield*/, createAndSendV0Tx([addAddressesInstruction])];
                case 1:
                    // Step 2 - Generate a transaction and send it to the network
                    _a.sent();
                    console.log("Lookup Table Entries: ", "https://explorer.solana.com/address/".concat(LOOKUP_TABLE_ADDRESS.toString(), "/entries?cluster=devnet"));
                    return [2 /*return*/];
            }
        });
    });
});
