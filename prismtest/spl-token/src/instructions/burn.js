"use strict";
exports.__esModule = true;
exports.decodeBurnInstructionUnchecked = exports.decodeBurnInstruction = exports.createBurnInstruction = exports.burnInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.burnInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_utils_1.u64)('amount')]);
/**
 * Construct a Burn instruction
 *
 * @param account      Account to burn tokens from
 * @param mint         Mint for the account
 * @param owner        Owner of the account
 * @param amount       Number of tokens to burn
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createBurnInstruction(account, mint, owner, amount, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: true },
    ], owner, multiSigners);
    var data = Buffer.alloc(exports.burnInstructionData.span);
    exports.burnInstructionData.encode({
        instruction: types_1.TokenInstruction.Burn,
        amount: BigInt(amount)
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createBurnInstruction = createBurnInstruction;
/**
 * Decode a Burn instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeBurnInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.burnInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeBurnInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, mint = _b.mint, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.Burn)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !mint || !owner)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeBurnInstruction = decodeBurnInstruction;
/**
 * Decode a Burn instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeBurnInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], mint = _b[1], owner = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            multiSigners: multiSigners
        },
        data: exports.burnInstructionData.decode(data)
    };
}
exports.decodeBurnInstructionUnchecked = decodeBurnInstructionUnchecked;
