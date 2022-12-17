"use strict";
exports.__esModule = true;
exports.decodeFreezeAccountInstructionUnchecked = exports.decodeFreezeAccountInstruction = exports.createFreezeAccountInstruction = exports.freezeAccountInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.freezeAccountInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction')]);
/**
 * Construct a FreezeAccount instruction
 *
 * @param account      Account to freeze
 * @param mint         Mint account
 * @param authority    Mint freeze authority
 * @param multiSigners Signing accounts if `authority` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createFreezeAccountInstruction(account, mint, authority, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
    ], authority, multiSigners);
    var data = Buffer.alloc(exports.freezeAccountInstructionData.span);
    exports.freezeAccountInstructionData.encode({ instruction: types_1.TokenInstruction.FreezeAccount }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createFreezeAccountInstruction = createFreezeAccountInstruction;
/**
 * Decode a FreezeAccount instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeFreezeAccountInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.freezeAccountInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeFreezeAccountInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, mint = _b.mint, authority = _b.authority, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.FreezeAccount)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !mint || !authority)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            authority: authority,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeFreezeAccountInstruction = decodeFreezeAccountInstruction;
/**
 * Decode a FreezeAccount instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeFreezeAccountInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], mint = _b[1], authority = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            authority: authority,
            multiSigners: multiSigners
        },
        data: exports.freezeAccountInstructionData.decode(data)
    };
}
exports.decodeFreezeAccountInstructionUnchecked = decodeFreezeAccountInstructionUnchecked;
