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
exports.getAldrinPools = exports.getAldrinCacheData = void 0;
const sdk_1 = require("@aldrin_exchange/sdk");
function getAldrinCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const poolClient = new sdk_1.PoolClient(connection);
            const [pools, v2Pools] = yield Promise.all([
                poolClient.getPools(),
                poolClient.getV2Pools(),
            ]);
            return {
                poolsInit: pools,
                v2Pools: v2Pools,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getAldrinCacheData = getAldrinCacheData;
function getAldrinPools(connection, data) {
    try {
        const poolClient = new sdk_1.PoolClient(connection);
        const tokenClient = new sdk_1.TokenClient(connection);
        const farmingClient = new sdk_1.FarmingClient(connection);
        let poolsInit = data.poolsInit;
        let v2Pools = data.v2Pools;
        let tokenSwap = new sdk_1.TokenSwap([...poolsInit, ...v2Pools], poolClient, tokenClient, farmingClient, connection);
        //@ts-ignore
        if (!tokenSwap || !tokenSwap.pools)
            return {};
        //@ts-ignore
        let allPools = tokenSwap.pools;
        let pools = {};
        for (let i = 0; i < allPools.length; i++) {
            let pool = Object.assign(Object.assign({}, allPools[i]), { provider: "aldrin" });
            let coinMint = pool.baseTokenMint.toBase58();
            let pcMint = pool.quoteTokenMint.toBase58();
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
exports.getAldrinPools = getAldrinPools;
