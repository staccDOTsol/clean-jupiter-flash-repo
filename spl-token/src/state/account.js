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
exports.getMinimumBalanceForRentExemptAccount = exports.getAccount = exports.ACCOUNT_SIZE = exports.AccountLayout = exports.AccountState = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
/** Token account state as stored by the program */
var AccountState;
(function (AccountState) {
    AccountState[AccountState["Uninitialized"] = 0] = "Uninitialized";
    AccountState[AccountState["Initialized"] = 1] = "Initialized";
    AccountState[AccountState["Frozen"] = 2] = "Frozen";
})(AccountState = exports.AccountState || (exports.AccountState = {}));
/** Buffer layout for de/serializing a token account */
exports.AccountLayout = (0, buffer_layout_1.struct)([
    (0, buffer_layout_utils_1.publicKey)('mint'),
    (0, buffer_layout_utils_1.publicKey)('owner'),
    (0, buffer_layout_utils_1.u64)('amount'),
    (0, buffer_layout_1.u32)('delegateOption'),
    (0, buffer_layout_utils_1.publicKey)('delegate'),
    (0, buffer_layout_1.u8)('state'),
    (0, buffer_layout_1.u32)('isNativeOption'),
    (0, buffer_layout_utils_1.u64)('isNative'),
    (0, buffer_layout_utils_1.u64)('delegatedAmount'),
    (0, buffer_layout_1.u32)('closeAuthorityOption'),
    (0, buffer_layout_utils_1.publicKey)('closeAuthority'),
]);
/** Byte length of a token account */
exports.ACCOUNT_SIZE = exports.AccountLayout.span;
/**
 * Retrieve information about a token account
 *
 * @param connection Connection to use
 * @param address    Token account
 * @param commitment Desired level of commitment for querying the state
 * @param programId  SPL Token program account
 *
 * @return Token account information
 */
function getAccount(connection, address, commitment, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    return __awaiter(this, void 0, void 0, function () {
        var info, rawAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getAccountInfo(address, commitment)];
                case 1:
                    info = _a.sent();
                    if (!info)
                        throw new errors_1.TokenAccountNotFoundError();
                    if (!info.owner.equals(programId))
                        throw new errors_1.TokenInvalidAccountOwnerError();
                    if (info.data.length != exports.ACCOUNT_SIZE)
                        throw new errors_1.TokenInvalidAccountSizeError();
                    rawAccount = exports.AccountLayout.decode(info.data);
                    return [2 /*return*/, {
                            address: address,
                            mint: rawAccount.mint,
                            owner: rawAccount.owner,
                            amount: rawAccount.amount,
                            delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
                            delegatedAmount: rawAccount.delegatedAmount,
                            isInitialized: rawAccount.state !== AccountState.Uninitialized,
                            isFrozen: rawAccount.state === AccountState.Frozen,
                            isNative: !!rawAccount.isNativeOption,
                            rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
                            closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null
                        }];
            }
        });
    });
}
exports.getAccount = getAccount;
/** Get the minimum lamport balance for a token account to be rent exempt
 *
 * @param connection Connection to use
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
function getMinimumBalanceForRentExemptAccount(connection, commitment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(exports.ACCOUNT_SIZE, commitment)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getMinimumBalanceForRentExemptAccount = getMinimumBalanceForRentExemptAccount;
