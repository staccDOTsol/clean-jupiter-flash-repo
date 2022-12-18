"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifinityPools = void 0;
const sdk_1 = require("@lifinity/sdk");
function getLifinityPools() {
    try {
        const lifinityPools = (0, sdk_1.getPoolList)();
        let pools = {};
        for (const [_, lifinityPool] of Object.entries(lifinityPools)) {
            let pool = Object.assign(Object.assign({}, lifinityPool), { provider: "lifinity" });
            //console.log(pool.quoteTokenVault.toBase58())
            //console.log(pool.baseTokenVault.toBase58())
            let coinMint = pool.poolCoinMint;
            let pcMint = pool.poolPcMint;
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
exports.getLifinityPools = getLifinityPools;
