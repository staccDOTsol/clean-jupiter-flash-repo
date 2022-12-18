"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSaber = exports._loadSaber = exports.findSwapAuthorityKey = exports.loadSingle = void 0;
const stableswap_sdk_1 = require("@saberhq/stableswap-sdk");
const web3_js_1 = require("@solana/web3.js");
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
function loadSingle(stableSwap, reserveA, reserveB) {
    let state = stableSwap.state;
    let exchange = (0, stableswap_sdk_1.makeExchange)({
        swapAccount: stableSwap.config.swapAccount,
        lpToken: state.poolTokenMint,
        tokenA: {
            chainId: 101,
            address: state.tokenA.mint.toBase58(),
            name: 'A',
            decimals: 0,
            symbol: 'A'
        },
        tokenB: {
            chainId: 101,
            address: state.tokenB.mint.toBase58(),
            name: 'B',
            decimals: 0,
            symbol: 'B'
        }
    });
    if (!exchange || !(reserveA === null || reserveA === void 0 ? void 0 : reserveA.account) || !(reserveB === null || reserveB === void 0 ? void 0 : reserveB.account))
        return {};
    let exchangeInfo = (0, stableswap_sdk_1.makeExchangeInfo)({
        //@ts-ignore
        exchange: exchange,
        swap: stableSwap,
        accounts: {
            //@ts-ignore
            reserveA: reserveA.account.data,
            //@ts-ignore
            reserveB: reserveB.account.data,
        }
    });
    return {
        stableSwap: stableSwap,
        reserveA: reserveA,
        reserveB: reserveB,
        exchange: exchange,
        exchangeInfo: exchangeInfo,
    };
}
exports.loadSingle = loadSingle;
function findSwapAuthorityKey(swapAccount) {
    return (0, pubkey_1.findProgramAddressSync)([swapAccount.toBuffer()], stableswap_sdk_1.SWAP_PROGRAM_ID)[0];
}
exports.findSwapAuthorityKey = findSwapAuthorityKey;
function _loadSaber(liquidity) {
    try {
        if (!liquidity || liquidity.length == 0)
            return [];
        let stableSwaps = [];
        //@ts-ignore
        let accountDatas = [];
        for (let i = 0; i < liquidity.length; i++) {
            accountDatas.push(liquidity[i].swapAccountData);
        }
        //@ts-ignore
        let authorities = liquidity.map(swap => (0, pubkey_1.findProgramAddressSync)([new web3_js_1.PublicKey(swap.addresses.swapAccount).toBuffer()], stableswap_sdk_1.SWAP_PROGRAM_ID)[0]);
        for (let i = 0; i < liquidity.length; i++)
            stableSwaps.push(stableswap_sdk_1.StableSwap.loadWithData(new web3_js_1.PublicKey(liquidity[i].addresses.swapAccount), Buffer.from(accountDatas[i].account.data), authorities[i]));
        let accounts = [];
        for (let i = 0; i < stableSwaps.length; i++) {
            accounts.push({ account: stableSwaps[i].state.tokenA.reserve, provider: "saber" });
            accounts.push({ account: stableSwaps[i].state.tokenB.reserve, provider: "saber" });
        }
        return accounts;
    }
    catch (_a) {
        return [];
    }
}
exports._loadSaber = _loadSaber;
function loadSaber(liquidity, results) {
    try {
        if (!liquidity || liquidity.length == 0 || !results)
            return {};
        let saberSwaps = {};
        let stableSwaps = [];
        //@ts-ignore
        let accountDatas = [];
        for (let i = 0; i < liquidity.length; i++) {
            accountDatas.push(liquidity[i].swapAccountData);
        }
        //@ts-ignore
        let authorities = liquidity.map(swap => (0, pubkey_1.findProgramAddressSync)([new web3_js_1.PublicKey(swap.addresses.swapAccount).toBuffer()], stableswap_sdk_1.SWAP_PROGRAM_ID)[0]);
        for (let i = 0; i < liquidity.length; i++)
            stableSwaps.push(stableswap_sdk_1.StableSwap.loadWithData(new web3_js_1.PublicKey(liquidity[i].addresses.swapAccount), Buffer.from(accountDatas[i].account.data), authorities[i]));
        for (let i = 0; i < stableSwaps.length; i++) {
            if (stableSwaps[i].state.isPaused == true)
                continue;
            saberSwaps[liquidity[i].addresses.swapAccount] = loadSingle(stableSwaps[i], results[2 * i], results[2 * i + 1]);
        }
        return saberSwaps;
    }
    catch (_a) {
        return {};
    }
}
exports.loadSaber = loadSaber;
