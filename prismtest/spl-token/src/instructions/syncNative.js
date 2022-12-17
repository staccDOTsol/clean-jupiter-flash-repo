"use strict";
exports.__esModule = true;
exports.decodeSyncNativeInstructionUnchecked = exports.decodeSyncNativeInstruction = exports.createSyncNativeInstruction = exports.syncNativeInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var types_1 = require("./types");
/** TODO: docs */
exports.syncNativeInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction')]);
/**
 * Construct a SyncNative instruction
 *
 * @param account   Native account to sync lamports from
 * @param programId SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createSyncNativeInstruction(account, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = [{ pubkey: account, isSigner: false, isWritable: true }];
    var data = Buffer.alloc(exports.syncNativeInstructionData.span);
    exports.syncNativeInstructionData.encode({ instruction: types_1.TokenInstruction.SyncNative }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createSyncNativeInstruction = createSyncNativeInstruction;
/**
 * Decode a SyncNative instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeSyncNativeInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.syncNativeInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeSyncNativeInstructionUnchecked(instruction), account = _a.keys.account, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.SyncNative)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account
        },
        data: data
    };
}
exports.decodeSyncNativeInstruction = decodeSyncNativeInstruction;
/**
 * Decode a SyncNative instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeSyncNativeInstructionUnchecked(_a) {
    var programId = _a.programId, account = _a.keys[0], data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account
        },
        data: exports.syncNativeInstructionData.decode(data)
    };
}
exports.decodeSyncNativeInstructionUnchecked = decodeSyncNativeInstructionUnchecked;
