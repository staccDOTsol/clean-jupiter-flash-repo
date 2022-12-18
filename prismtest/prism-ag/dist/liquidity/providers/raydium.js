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
exports.getRaydiumAmms = exports.getRaydiumCacheData = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../types/types");
const common_1 = require("./common");
function getRaydiumCacheData(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let ammInfos = yield (0, common_1.getFilteredProgramAccountsAmmOrMarketCache)('amm', connection, new web3_js_1.PublicKey(types_1.LIQUIDITY_POOL_PROGRAM_ID_V4), [{ dataSize: types_1.AMM_INFO_LAYOUT_V4.span }]);
            return {
                ammInfos: ammInfos,
            };
        }
        catch (_a) {
            return {};
        }
    });
}
exports.getRaydiumCacheData = getRaydiumCacheData;
function getRaydiumAmms(data) {
    try {
        const amms = {};
        let ammInfos = data.ammInfos;
        ammInfos.forEach((ammInfo) => {
            let amm = Object.assign(Object.assign({}, types_1.AMM_INFO_LAYOUT_V4.decode(Buffer.from(ammInfo.accountInfo.data))), { provider: "raydium", ammId: ammInfo.publicKey });
            if (amm.status.toNumber() == 6) {
                let coinMint = amm.coinMintAddress.toBase58();
                let pcMint = amm.pcMintAddress.toBase58();
                //console.log(coinMint)
                //console.log(pcMint)
                if (coinMint != pcMint) {
                    (amms[coinMint] || (amms[coinMint] = [])).push(Object.assign(Object.assign({}, amm), { other: pcMint }));
                    (amms[pcMint] || (amms[pcMint] = [])).push(Object.assign(Object.assign({}, amm), { other: coinMint }));
                }
            }
        });
        return amms;
    }
    catch (_a) {
        return {};
    }
}
exports.getRaydiumAmms = getRaydiumAmms;
