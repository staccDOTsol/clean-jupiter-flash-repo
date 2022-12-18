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
exports.getAssociatedTokenAddress = exports.getMinimumBalanceForRentExemptMint = exports.getMint = exports.MINT_SIZE = exports.MintLayout = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
/** Buffer layout for de/serializing a mint */
exports.MintLayout = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u32)('mintAuthorityOption'),
    (0, buffer_layout_utils_1.publicKey)('mintAuthority'),
    (0, buffer_layout_utils_1.u64)('supply'),
    (0, buffer_layout_1.u8)('decimals'),
    (0, buffer_layout_utils_1.bool)('isInitialized'),
    (0, buffer_layout_1.u32)('freezeAuthorityOption'),
    (0, buffer_layout_utils_1.publicKey)('freezeAuthority'),
]);
/** Byte length of a mint */
exports.MINT_SIZE = exports.MintLayout.span;
/**
 * Retrieve information about a mint
 *
 * @param connection Connection to use
 * @param address    Mint account
 * @param commitment Desired level of commitment for querying the state
 * @param programId  SPL Token program account
 *
 * @return Mint information
 */
function getMint(connection, address, commitment, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    return __awaiter(this, void 0, void 0, function () {
        var info, rawMint;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getAccountInfo(address, commitment)];
                case 1:
                    info = _a.sent();
                    if (!info)
                        throw new errors_1.TokenAccountNotFoundError();
                    if (!info.owner.equals(programId))
                        throw new errors_1.TokenInvalidAccountOwnerError();
                    if (info.data.length != exports.MINT_SIZE)
                        throw new errors_1.TokenInvalidAccountSizeError();
                    rawMint = exports.MintLayout.decode(info.data);
                    return [2 /*return*/, {
                            address: address,
                            mintAuthority: rawMint.mintAuthorityOption ? rawMint.mintAuthority : null,
                            supply: rawMint.supply,
                            decimals: rawMint.decimals,
                            isInitialized: rawMint.isInitialized,
                            freezeAuthority: rawMint.freezeAuthorityOption ? rawMint.freezeAuthority : null
                        }];
            }
        });
    });
}
exports.getMint = getMint;
/** Get the minimum lamport balance for a mint to be rent exempt
 *
 * @param connection Connection to use
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
function getMinimumBalanceForRentExemptMint(connection, commitment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(exports.MINT_SIZE, commitment)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getMinimumBalanceForRentExemptMint = getMinimumBalanceForRentExemptMint;
/**
 * Get the address of the associated token account for a given mint and owner
 *
 * @param mint                     Token mint account
 * @param owner                    Owner of the new account
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Address of the associated token account
 */
function getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve, programId, associatedTokenProgramId) {
    if (allowOwnerOffCurve === void 0) { allowOwnerOffCurve = false; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (associatedTokenProgramId === void 0) { associatedTokenProgramId = constants_1.ASSOCIATED_TOKEN_PROGRAM_ID; }
    return __awaiter(this, void 0, void 0, function () {
        var address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!allowOwnerOffCurve && !web3_js_1.PublicKey.isOnCurve(owner.toBuffer()))
                        throw new errors_1.TokenOwnerOffCurveError();
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([owner.toBuffer(), programId.toBuffer(), mint.toBuffer()], associatedTokenProgramId)];
                case 1:
                    address = (_a.sent())[0];
                    return [2 /*return*/, address];
            }
        });
    });
}
exports.getAssociatedTokenAddress = getAssociatedTokenAddress;
