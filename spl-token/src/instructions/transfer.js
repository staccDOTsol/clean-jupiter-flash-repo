"use strict";
exports.__esModule = true;
exports.decodeTransferInstructionUnchecked = exports.decodeTransferInstruction = exports.createTransferInstruction = exports.transferInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.transferInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_utils_1.u64)('amount')]);
/**
 * Construct a Transfer instruction
 *
 * @param source       Source account
 * @param destination  Destination account
 * @param owner        Owner of the source account
 * @param amount       Number of tokens to transfer
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createTransferInstruction(source, destination, owner, amount, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
    ], owner, multiSigners);
    var data = Buffer.alloc(exports.transferInstructionData.span);
    exports.transferInstructionData.encode({
        instruction: types_1.TokenInstruction.Transfer,
        amount: BigInt(amount)
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createTransferInstruction = createTransferInstruction;
/**
 * Decode a Transfer instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeTransferInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.transferInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeTransferInstructionUnchecked(instruction), _b = _a.keys, source = _b.source, destination = _b.destination, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.Transfer)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!source || !destination || !owner)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            source: source,
            destination: destination,
            owner: owner,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeTransferInstruction = decodeTransferInstruction;
/**
 * Decode a Transfer instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeTransferInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, source = _b[0], destination = _b[1], owner = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            source: source,
            destination: destination,
            owner: owner,
            multiSigners: multiSigners
        },
        data: exports.transferInstructionData.decode(data)
    };
}
exports.decodeTransferInstructionUnchecked = decodeTransferInstructionUnchecked;
