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
exports.customGetMultipleAccountInfos = void 0;
function customGetMultipleAccountInfos(connection, accounts, source) {
    return __awaiter(this, void 0, void 0, function* () {
        let promises = [];
        let current = [];
        for (let i = 0; i < accounts.length; i++) {
            current.push(accounts[i]);
            if (current.length == 100 || i + 1 == accounts.length) {
                promises.push(connection.getMultipleAccountsInfo(current));
                current = [];
            }
        }
        let pro = yield Promise.all(promises);
        let results = [];
        for (let i = 0; i < pro.length; i++) {
            for (let j = 0; j < pro[i].length; j++)
                results.push({
                    account: pro[i][j],
                    publicKey: accounts[i * 100 + j]
                });
        }
        return results;
    });
}
exports.customGetMultipleAccountInfos = customGetMultipleAccountInfos;
