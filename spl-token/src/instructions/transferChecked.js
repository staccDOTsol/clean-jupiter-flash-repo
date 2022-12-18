"use strict";
exports.__esModule = true;
exports.decodeTransferCheckedInstructionUnchecked = exports.decodeTransferCheckedInstruction = exports.createTransferCheckedInstruction = exports.transferCheckedInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.transferCheckedInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_utils_1.u64)('amount'),
    (0, buffer_layout_1.u8)('decimals'),
]);
/**
 * Construct a TransferChecked instruction
 *
 * @param source       Source account
 * @param mint         Mint account
 * @param destination  Destination account
 * @param owner        Owner of the source account
 * @param amount       Number of tokens to transfer
 * @param decimals     Number of decimals in transfer amount
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createTransferCheckedInstruction(source, mint, destination, owner, amount, decimals, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: destination, isSigner: false, isWritable: true },
    ], owner, multiSigners);
    var data = Buffer.alloc(exports.transferCheckedInstructionData.span);
    exports.transferCheckedInstructionData.encode({
        instruction: types_1.TokenInstruction.TransferChecked,
        amount: BigInt(amount),
        decimals: decimals
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createTransferCheckedInstruction = createTransferCheckedInstruction;
/**
 * Decode a TransferChecked instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeTransferCheckedInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.transferCheckedInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeTransferCheckedInstructionUnchecked(instruction), _b = _a.keys, source = _b.source, mint = _b.mint, destination = _b.destination, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.TransferChecked)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!source || !mint || !destination || !owner)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            source: source,
            mint: mint,
            destination: destination,
            owner: owner,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeTransferCheckedInstruction = decodeTransferCheckedInstruction;
/**
 * Decode a TransferChecked instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeTransferCheckedInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, source = _b[0], mint = _b[1], destination = _b[2], owner = _b[3], multiSigners = _b.slice(4), data = _a.data;
    return {
        programId: programId,
        keys: {
            source: source,
            mint: mint,
            destination: destination,
            owner: owner,
            multiSigners: multiSigners
        },
        data: exports.transferCheckedInstructionData.decode(data)
    };
}
exports.decodeTransferCheckedInstructionUnchecked = decodeTransferCheckedInstructionUnchecked;
