"use strict";
exports.__esModule = true;
exports.decodeRevokeInstructionUnchecked = exports.decodeRevokeInstruction = exports.createRevokeInstruction = exports.revokeInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.revokeInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction')]);
/**
 * Construct a Revoke instruction
 *
 * @param account      Address of the token account
 * @param owner        Owner of the account
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createRevokeInstruction(account, owner, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([{ pubkey: account, isSigner: false, isWritable: true }], owner, multiSigners);
    var data = Buffer.alloc(exports.revokeInstructionData.span);
    exports.revokeInstructionData.encode({ instruction: types_1.TokenInstruction.Revoke }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createRevokeInstruction = createRevokeInstruction;
/**
 * Decode a Revoke instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeRevokeInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.revokeInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeRevokeInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.Revoke)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !owner)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            owner: owner,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeRevokeInstruction = decodeRevokeInstruction;
/**
 * Decode a Revoke instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeRevokeInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], owner = _b[1], multiSigners = _b.slice(2), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            owner: owner,
            multiSigners: multiSigners
        },
        data: exports.revokeInstructionData.decode(data)
    };
}
exports.decodeRevokeInstructionUnchecked = decodeRevokeInstructionUnchecked;
