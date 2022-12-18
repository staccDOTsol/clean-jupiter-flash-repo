"use strict";
exports.__esModule = true;
exports.decodeApproveInstructionUnchecked = exports.decodeApproveInstruction = exports.createApproveInstruction = exports.approveInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.approveInstructionData = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_utils_1.u64)('amount')]);
/**
 * Construct an Approve instruction
 *
 * @param account      Account to set the delegate for
 * @param delegate     Account authorized to transfer tokens from the account
 * @param owner        Owner of the account
 * @param amount       Maximum number of tokens the delegate may transfer
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createApproveInstruction(account, delegate, owner, amount, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: delegate, isSigner: false, isWritable: false },
    ], owner, multiSigners);
    var data = Buffer.alloc(exports.approveInstructionData.span);
    exports.approveInstructionData.encode({
        instruction: types_1.TokenInstruction.Approve,
        amount: BigInt(amount)
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createApproveInstruction = createApproveInstruction;
/**
 * Decode an Approve instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeApproveInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.approveInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeApproveInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, delegate = _b.delegate, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.Approve)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !delegate || !owner)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            delegate: delegate,
            owner: owner,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeApproveInstruction = decodeApproveInstruction;
/**
 * Decode an Approve instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeApproveInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], delegate = _b[1], owner = _b[2], multiSigners = _b.slice(3), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            delegate: delegate,
            owner: owner,
            multiSigners: multiSigners
        },
        data: exports.approveInstructionData.decode(data)
    };
}
exports.decodeApproveInstructionUnchecked = decodeApproveInstructionUnchecked;
