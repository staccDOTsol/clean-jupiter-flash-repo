"use strict";
exports.__esModule = true;
exports.decodeInitializeMultisigInstructionUnchecked = exports.decodeInitializeMultisigInstruction = exports.createInitializeMultisigInstruction = exports.initializeMultisigInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var types_1 = require("./types");
/** TODO: docs */
exports.initializeMultisigInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_1.u8)('m'),
]);
/**
 * Construct an InitializeMultisig instruction
 *
 * @param account   Multisig account
 * @param signers   Full set of signers
 * @param m         Number of required signatures
 * @param programId SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createInitializeMultisigInstruction(account, signers, m, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = [
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    for (var _i = 0, signers_1 = signers; _i < signers_1.length; _i++) {
        var signer = signers_1[_i];
        keys.push({ pubkey: signer, isSigner: false, isWritable: false });
    }
    var data = Buffer.alloc(exports.initializeMultisigInstructionData.span);
    exports.initializeMultisigInstructionData.encode({
        instruction: types_1.TokenInstruction.InitializeMultisig,
        m: m
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createInitializeMultisigInstruction = createInitializeMultisigInstruction;
/**
 * Decode an InitializeMultisig instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeInitializeMultisigInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.initializeMultisigInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeInitializeMultisigInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, rent = _b.rent, signers = _b.signers, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.InitializeMultisig)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !rent || !signers.length)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            rent: rent,
            signers: signers
        },
        data: data
    };
}
exports.decodeInitializeMultisigInstruction = decodeInitializeMultisigInstruction;
/**
 * Decode an InitializeMultisig instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeInitializeMultisigInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], rent = _b[1], signers = _b.slice(2), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            rent: rent,
            signers: signers
        },
        data: exports.initializeMultisigInstructionData.decode(data)
    };
}
exports.decodeInitializeMultisigInstructionUnchecked = decodeInitializeMultisigInstructionUnchecked;
