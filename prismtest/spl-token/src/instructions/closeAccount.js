"use strict";
exports.__esModule = true;
exports.decodeCloseAccountInstructionUnchecked = exports.decodeCloseAccountInstruction = exports.createCloseAccountInstruction = exports.closeAccountInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.closeAccountInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction')]);
/**
 * Construct a CloseAccount instruction
 *
 * @param account      Account to close
 * @param destination  Account to receive the remaining balance of the closed account
 * @param authority    Account close authority
 * @param multiSigners Signing accounts if `authority` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createCloseAccountInstruction(account, destination, authority, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
    ], authority, multiSigners);
    var data = Buffer.alloc(exports.closeAccountInstructionData.span);
    exports.closeAccountInstructionData.encode({ instruction: types_1.TokenInstruction.CloseAccount }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createCloseAccountInstruction = createCloseAccountInstruction;
/**
 * Decode a CloseAccount instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeCloseAccountInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.closeAccountInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeCloseAccountInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, destination = _b.destination, authority = _b.authority, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.CloseAccount)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !destination || !authority)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            destination: destination,
            authority: authority,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeCloseAccountInstruction = decodeCloseAccountInstruction;
/**
 * Decode a CloseAccount instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeCloseAccountInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], destination = _b[1], authority = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            destination: destination,
            authority: authority,
            multiSigners: multiSigners
        },
        data: exports.closeAccountInstructionData.decode(data)
    };
}
exports.decodeCloseAccountInstructionUnchecked = decodeCloseAccountInstructionUnchecked;
