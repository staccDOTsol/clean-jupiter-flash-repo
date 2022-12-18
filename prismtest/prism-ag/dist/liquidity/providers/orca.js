"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrcaPools = void 0;
const sdk_1 = require("@orca-so/sdk");
function getOrcaPools(connection) {
    try {
        let orca = (0, sdk_1.getOrca)(connection);
        let pools = {};
        for (let [_, poolId] of Object.entries(sdk_1.OrcaPoolConfig)) {
            let pool = orca.getPool(poolId);
            let coinMint = pool.getTokenA().mint.toBase58();
            let pcMint = pool.getTokenB().mint.toBase58();
            console.log(coinMint)
            console.log(pcMint)
            (pools[coinMint] || (pools[coinMint] = []))
                .push({ pool: pool, other: pcMint, provider: "orca" });
            (pools[pcMint] || (pools[pcMint] = []))
                .push({ pool: pool, other: coinMint, provider: "orca" });
        }
        return pools;
    }
    catch (_a) {
        return {};
    }
}
exports.getOrcaPools = getOrcaPools;
