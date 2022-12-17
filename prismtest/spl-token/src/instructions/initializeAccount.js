"use strict";
exports.__esModule = true;
exports.decodeInitializeAccountInstructionUnchecked = exports.decodeInitializeAccountInstruction = exports.createInitializeAccountInstruction = exports.initializeAccountInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var types_1 = require("./types");
/** TODO: docs */
exports.initializeAccountInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction')]);
/**
 * Construct an InitializeAccount instruction
 *
 * @param account   New token account
 * @param mint      Mint account
 * @param owner     Owner of the new account
 * @param programId SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createInitializeAccountInstruction(account, mint, owner, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = [
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    var data = Buffer.alloc(exports.initializeAccountInstructionData.span);
    exports.initializeAccountInstructionData.encode({ instruction: types_1.TokenInstruction.InitializeAccount }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createInitializeAccountInstruction = createInitializeAccountInstruction;
/**
 * Decode an InitializeAccount instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeInitializeAccountInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.initializeAccountInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeInitializeAccountInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, mint = _b.mint, owner = _b.owner, rent = _b.rent, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.InitializeAccount)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !mint || !owner || !rent)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            rent: rent
        },
        data: data
    };
}
exports.decodeInitializeAccountInstruction = decodeInitializeAccountInstruction;
/**
 * Decode an InitializeAccount instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeInitializeAccountInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], mint = _b[1], owner = _b[2], rent = _b[3], data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            owner: owner,
            rent: rent
        },
        data: exports.initializeAccountInstructionData.decode(data)
    };
}
exports.decodeInitializeAccountInstructionUnchecked = decodeInitializeAccountInstructionUnchecked;
