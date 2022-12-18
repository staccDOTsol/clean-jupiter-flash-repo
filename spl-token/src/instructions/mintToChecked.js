"use strict";
exports.__esModule = true;
exports.decodeMintToCheckedInstructionUnchecked = exports.decodeMintToCheckedInstruction = exports.createMintToCheckedInstruction = exports.mintToCheckedInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.mintToCheckedInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_utils_1.u64)('amount'),
    (0, buffer_layout_1.u8)('decimals'),
]);
/**
 * Construct a MintToChecked instruction
 *
 * @param mint         Public key of the mint
 * @param destination  Address of the token account to mint to
 * @param authority    The mint authority
 * @param amount       Amount to mint
 * @param decimals     Number of decimals in amount to mint
 * @param multiSigners Signing accounts if `authority` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createMintToCheckedInstruction(mint, destination, authority, amount, decimals, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
    ], authority, multiSigners);
    var data = Buffer.alloc(exports.mintToCheckedInstructionData.span);
    exports.mintToCheckedInstructionData.encode({
        instruction: types_1.TokenInstruction.MintToChecked,
        amount: BigInt(amount),
        decimals: decimals
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createMintToCheckedInstruction = createMintToCheckedInstruction;
/**
 * Decode a MintToChecked instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeMintToCheckedInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.mintToCheckedInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeMintToCheckedInstructionUnchecked(instruction), _b = _a.keys, mint = _b.mint, destination = _b.destination, authority = _b.authority, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.MintToChecked)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!mint || !destination || !authority)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            mint: mint,
            destination: destination,
            authority: authority,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeMintToCheckedInstruction = decodeMintToCheckedInstruction;
/**
 * Decode a MintToChecked instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeMintToCheckedInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, mint = _b[0], destination = _b[1], authority = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            mint: mint,
            destination: destination,
            authority: authority,
            multiSigners: multiSigners
        },
        data: exports.mintToCheckedInstructionData.decode(data)
    };
}
exports.decodeMintToCheckedInstructionUnchecked = decodeMintToCheckedInstructionUnchecked;
