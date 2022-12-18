"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStepnPools = void 0;
const web3_js_1 = require("@solana/web3.js");
const SOL_MINT = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
const USDC_MINT = new web3_js_1.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const GMT_MINT = new web3_js_1.PublicKey("7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx");
const GST_MINT = new web3_js_1.PublicKey("AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB");
const STEPN_POOLS = [
    {
        address: new web3_js_1.PublicKey("5GGvkcqQ1554ibdc18JXiPqR8aJz6WV3JSNShoj32ufT"),
        nonce: 255,
        authority: new web3_js_1.PublicKey("5w1nmqvpus3UfpP67EpYuHhE63aSFdF5AT8VHZTkvnp5"),
        poolTokenMint: new web3_js_1.PublicKey("DajMqwbJXA7JbqgU97zycA1zReQhmTqf1YjNNQjo6gCQ"),
        poolTokenDecimals: 2,
        feeAccount: new web3_js_1.PublicKey("wLavAJvGZa6Try8jxPRLc9AXBN4yCLF2qpFKbRNB4wF"),
        mintA: SOL_MINT,
        mintB: USDC_MINT,
        tokenAccountA: new web3_js_1.PublicKey("GVfKYBNMdaER21wwuqa4CSQV8ajVpuPbNZVV3wcuKWhE"),
        tokenAccountB: new web3_js_1.PublicKey("ARryk4nSoS6bu7nyv6BgQah8oU23svFm7Rek7kR4fy3X"),
    },
    {
        address: new web3_js_1.PublicKey("AkpQwi28Q5XgDCrmT6GtRCnhjSdx5hiU1DjSzKXGKUUf"),
        nonce: 255,
        authority: new web3_js_1.PublicKey("Cj9Asoa9k2RzkvP2WHWWzoGHp4qokHMHnQUaAN8jfSx9"),
        poolTokenMint: new web3_js_1.PublicKey("3eJArkszriMQNWMaTLUGNi2CxXNkbtc79AEDhsYm1n3U"),
        poolTokenDecimals: 2,
        feeAccount: new web3_js_1.PublicKey("Gjob7RLsmbHvDA6br4sSFKFJsycwnQtdNZGJKqH9GgaF"),
        mintA: GST_MINT,
        mintB: USDC_MINT,
        tokenAccountA: new web3_js_1.PublicKey("HxxC4ugMgGLc5MAtsYfYZsFyP3EqiPzNNNNaxbkKsk6y"),
        tokenAccountB: new web3_js_1.PublicKey("7n6tCH5pGJS8xVdWs3wjZZprHTrmDT2y5vnhCXY3irig"),
    },
    {
        address: new web3_js_1.PublicKey("HQ1XxvXdEk3adEFgvbZgghhp8Aizor6W7m4VoRDx2f9i"),
        nonce: 255,
        authority: new web3_js_1.PublicKey("DJnoqj9mtQzAxwkK7Uv3mQEunamovdCQZYGwZZy3tZ6r"),
        poolTokenMint: new web3_js_1.PublicKey("88o6mPgy4jw9Egkyd1kNABW6WCiXXb4DpefM5uCDNQGK"),
        poolTokenDecimals: 2,
        feeAccount: new web3_js_1.PublicKey("CqbpJQUSYDuhL4JEHMXhGWjzLfJmgC5MUPRrZ4CFwipd"),
        mintA: GMT_MINT,
        mintB: USDC_MINT,
        tokenAccountA: new web3_js_1.PublicKey("FQ5i7oCTe1n3WALyWNiT72eP33NrMEC9LgvCoYcBPhoh"),
        tokenAccountB: new web3_js_1.PublicKey("6nwK7nXb5q1EUmAD2fKF5XjBZnkeZYm4xfF1GEraB1XH"),
    }
];
function getStepnPools() {
    try {
        let pools = {};
        for (let i = 0; i < STEPN_POOLS.length; i++) {
            let pool = Object.assign(Object.assign({}, STEPN_POOLS[i]), { swapAccount: STEPN_POOLS[i].address.toBase58(), provider: "stepn" });
            let coinMint = pool.mintA.toBase58();
            let pcMint = pool.mintB.toBase58();
            console.log(coinMint)
            console.log(pcMint)
            (pools[coinMint] || (pools[coinMint] = [])).push(Object.assign(Object.assign({}, pool), { other: pcMint }));
            (pools[pcMint] || (pools[pcMint] = [])).push(Object.assign(Object.assign({}, pool), { other: coinMint }));
        }
        return pools;
    }
    catch (_a) {
        return {};
    }
}
exports.getStepnPools = getStepnPools;
