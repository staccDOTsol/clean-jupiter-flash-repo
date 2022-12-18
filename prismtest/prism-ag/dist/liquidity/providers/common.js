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
exports.getFilteredProgramAccountsAmmOrMarketCache = exports.getFilteredProgramAccounts = void 0;
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
function getFilteredProgramAccounts(connection, programId, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const resp = yield connection._rpcRequest('getProgramAccounts', [
            programId.toBase58(),
            {
                commitment: connection.commitment,
                filters,
                encoding: 'base64'
            }
        ]);
        if (resp.error) {
            throw new Error(resp.error.message);
        }
        // @ts-ignore
        return resp.result.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
            publicKey: new web3_js_1.PublicKey(pubkey),
            accountInfo: {
                data: Buffer.from(data[0], 'base64'),
                executable,
                owner: new web3_js_1.PublicKey(owner),
                lamports
            }
        }));
    });
}
exports.getFilteredProgramAccounts = getFilteredProgramAccounts;
function getFilteredProgramAccountsAmmOrMarketCache(cacheName, connection, programId, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!cacheName) {
                throw new Error('cacheName error');
            }
            const resp = (yield axios_1.default.get('https://cache.prism.ag/' + cacheName + ".json")).data;
            if (resp.error) {
                throw new Error(resp.error.message);
            }
            // @ts-ignore
            return resp.result.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
                publicKey: new web3_js_1.PublicKey(pubkey),
                accountInfo: {
                    data: Buffer.from(data[0], 'base64'),
                    executable,
                    owner: new web3_js_1.PublicKey(owner),
                    lamports
                }
            }));
        }
        catch (e) {
            return getFilteredProgramAccounts(connection, programId, filters);
        }
    });
}
exports.getFilteredProgramAccountsAmmOrMarketCache = getFilteredProgramAccountsAmmOrMarketCache;
