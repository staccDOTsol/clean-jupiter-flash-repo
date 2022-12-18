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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGooseFxPools = exports.getGooseFxCacheData = exports.PAIR_LAYOUT = exports.ORACLE_LAYOUT = exports.ORACLE_ELEMENT_LAYOUT = void 0;
const common_1 = require("./common");
const types_1 = require("../../types/types");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("@project-serum/borsh");
const goosefx_ssl_sdk_prism_1 = require("goosefx-ssl-sdk-prism");
const getMultInfo_1 = require("../../utils/getMultInfo");
exports.ORACLE_ELEMENT_LAYOUT = (0, borsh_1.struct)([
    (0, borsh_1.publicKey)("address"),
    (0, borsh_1.bool)("inverse"),
]);
exports.ORACLE_LAYOUT = (0, borsh_1.struct)([
    (0, borsh_1.array)(exports.ORACLE_ELEMENT_LAYOUT, 4, "elements"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 4, 'padding'),
    (0, borsh_1.u64)("n"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 64),
]);
exports.PAIR_LAYOUT = (0, borsh_1.struct)([
    (0, borsh_1.array)((0, borsh_1.u8)(), 8, 'sighash'),
    (0, borsh_1.publicKey)("controller"),
    (0, borsh_1.array)((0, borsh_1.publicKey)("mint"), 2, "mints"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 8),
    (0, borsh_1.array)(exports.ORACLE_LAYOUT, 5, "oracles"),
    (0, borsh_1.u64)("nOracle"),
    (0, borsh_1.u8)("A"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 2, "feeRates"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 5),
    (0, borsh_1.u64)("maxDelay"),
    (0, borsh_1.u64)("confidence"),
    (0, borsh_1.publicKey)("balancer"),
    (0, borsh_1.u16)("excessiveConfiscateRate"),
    (0, borsh_1.publicKey)("feeCollector"),
    (0, borsh_1.array)((0, borsh_1.u16)(), 2, "platformFeeRate"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 18),
    (0, borsh_1.array)((0, borsh_1.u128)("volumes"), 2, "volumes"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 80),
    (0, borsh_1.bool)("enableRebalanceSwap"),
    (0, borsh_1.array)((0, borsh_1.u8)(), 151, "padding"),
]);
function getGooseFxCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let programAccounts = yield (0, common_1.getFilteredProgramAccounts)(connection, new web3_js_1.PublicKey(types_1.GOOSEFX_PROGRAM), [{ dataSize: 1536 }]);
            let swap = new goosefx_ssl_sdk_prism_1.Swap(connection);
            let pairDatas = [];
            let decodedPools = [];
            for (let i = 0; i < programAccounts.length; i++) {
                let decoded = exports.PAIR_LAYOUT.decode(programAccounts[i].accountInfo.data);
                let pool = Object.assign(Object.assign({}, decoded), { swapAccount: programAccounts[i].publicKey.toBase58(), provider: "gooseFX" });
                
            //console.log(pool.quoteTokenVault.toBase58())
            //console.log(pool.baseTokenVault.toBase58())
            if (pool.mints.length != 2)
                    continue;
                pairDatas.push(swap.getPairAddress(pool.mints[0], pool.mints[1]));
                decodedPools.push(pool);
            }
            let [pairDatasParsed, wasm] = yield Promise.all([
                (0, getMultInfo_1.customGetMultipleAccountInfos)(connection, pairDatas),
                swap.getWasm()
            ]);
            return {
                programAccounts: programAccounts,
                pairDatasParsed: pairDatasParsed,
                wasm: wasm,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getGooseFxCacheData = getGooseFxCacheData;
function getGooseFxPools(connection, data) {
    try {
        let programAccounts = data.programAccounts;
        let swap = new goosefx_ssl_sdk_prism_1.Swap(connection);
        let pairDatas = [];
        let decodedPools = [];
        for (let i = 0; i < programAccounts.length; i++) {
            let decoded = exports.PAIR_LAYOUT.decode(programAccounts[i].accountInfo.data);
            let pool = Object.assign(Object.assign({}, decoded), { swapAccount: programAccounts[i].publicKey.toBase58(), provider: "gooseFX" });
            
            //console.log(pool.quoteTokenVault.toBase58())
            //console.log(pool.baseTokenVault.toBase58())
            if (pool.mints.length != 2)
                continue;
            pairDatas.push(swap.getPairAddress(pool.mints[0], pool.mints[1]));
            decodedPools.push(pool);
        }
        let pairDatasParsed = data.pairDatasParsed;
        let wasm = data.wasm;
        let pools = {};
        for (let i = 0; i < pairDatas.length; i++) {
            let pool = decodedPools[i];
            pool.parsedPairData = pairDatasParsed[i].account;
            pool.swap = swap;
            pool.wasm = wasm;
            let coinMint = pool.mints[0].toBase58();
            let pcMint = pool.mints[1].toBase58();
            //console.log(coinMint)
            //console.log(pcMint)
            (pools[coinMint] || (pools[coinMint] = [])).push(Object.assign(Object.assign({}, pool), { other: pcMint }));
            (pools[pcMint] || (pools[pcMint] = [])).push(Object.assign(Object.assign({}, pool), { other: coinMint }));
        }
        return pools;
    }
    catch (_a) {
        return {};
    }
}
exports.getGooseFxPools = getGooseFxPools;
