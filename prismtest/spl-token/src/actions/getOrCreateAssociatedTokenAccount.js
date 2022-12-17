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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.getOrCreateAssociatedTokenAccount = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var index_1 = require("../instructions/index");
var index_2 = require("../state/index");
/**
 * Retrieve the associated token account, or create it if it doesn't exist
 *
 * @param connection               Connection to use
 * @param payer                    Payer of the transaction and initialization fees
 * @param mint                     Mint associated with the account to set or verify
 * @param owner                    Owner of the account to set or verify
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param commitment               Desired level of commitment for querying the state
 * @param confirmOptions           Options for confirming the transaction
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Address of the new associated token account
 */
function getOrCreateAssociatedTokenAccount(connection, payer, mint, owner, allowOwnerOffCurve, commitment, confirmOptions, programId, associatedTokenProgramId) {
    if (allowOwnerOffCurve === void 0) { allowOwnerOffCurve = false; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (associatedTokenProgramId === void 0) { associatedTokenProgramId = constants_1.ASSOCIATED_TOKEN_PROGRAM_ID; }
    return __awaiter(this, void 0, void 0, function () {
        var associatedToken, account, error_1, transaction, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, index_2.getAssociatedTokenAddress)(mint, owner, allowOwnerOffCurve, programId, associatedTokenProgramId)];
                case 1:
                    associatedToken = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 12]);
                    return [4 /*yield*/, (0, index_2.getAccount)(connection, associatedToken, commitment, programId)];
                case 3:
                    account = _a.sent();
                    return [3 /*break*/, 12];
                case 4:
                    error_1 = _a.sent();
                    if (!(error_1 instanceof errors_1.TokenAccountNotFoundError || error_1 instanceof errors_1.TokenInvalidAccountOwnerError)) return [3 /*break*/, 10];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    transaction = new web3_js_1.Transaction().add((0, index_1.createAssociatedTokenAccountInstruction)(payer.publicKey, associatedToken, owner, mint, programId, associatedTokenProgramId));
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [payer], confirmOptions)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [4 /*yield*/, (0, index_2.getAccount)(connection, associatedToken, commitment, programId)];
                case 9:
                    // Now this should always succeed
                    account = _a.sent();
                    return [3 /*break*/, 11];
                case 10: throw error_1;
                case 11: return [3 /*break*/, 12];
                case 12:
                    if (!account.mint.equals(mint))
                        throw new errors_1.TokenInvalidMintError();
                    if (!account.owner.equals(owner))
                        throw new errors_1.TokenInvalidOwnerError();
                    return [2 /*return*/, account];
            }
        });
    });
}
exports.getOrCreateAssociatedTokenAccount = getOrCreateAssociatedTokenAccount;
