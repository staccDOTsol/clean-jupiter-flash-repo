"use strict";
exports.__esModule = true;
exports.decodeApproveCheckedInstructionUnchecked = exports.decodeApproveCheckedInstruction = exports.createApproveCheckedInstruction = exports.approveCheckedInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** TODO: docs */
exports.approveCheckedInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_utils_1.u64)('amount'),
    (0, buffer_layout_1.u8)('decimals'),
]);
/**
 * Construct an ApproveChecked instruction
 *
 * @param account      Account to set the delegate for
 * @param mint         Mint account
 * @param delegate     Account authorized to transfer of tokens from the account
 * @param owner        Owner of the account
 * @param amount       Maximum number of tokens the delegate may transfer
 * @param decimals     Number of decimals in approve amount
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createApproveCheckedInstruction(account, mint, delegate, owner, amount, decimals, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: delegate, isSigner: false, isWritable: false },
    ], owner, multiSigners);
    var data = Buffer.alloc(exports.approveCheckedInstructionData.span);
    exports.approveCheckedInstructionData.encode({
        instruction: types_1.TokenInstruction.ApproveChecked,
        amount: BigInt(amount),
        decimals: decimals
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createApproveCheckedInstruction = createApproveCheckedInstruction;
/**
 * Decode an ApproveChecked instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeApproveCheckedInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.approveCheckedInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeApproveCheckedInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, mint = _b.mint, delegate = _b.delegate, owner = _b.owner, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.ApproveChecked)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !mint || !delegate || !owner)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            delegate: delegate,
            owner: owner,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeApproveCheckedInstruction = decodeApproveCheckedInstruction;
/**
 * Decode an ApproveChecked instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeApproveCheckedInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], mint = _b[1], delegate = _b[2], owner = _b[3], multiSigners = _b.slice(4), data = _a.data;
    return {
        programId: programId,
        keys: {
            account: account,
            mint: mint,
            delegate: delegate,
            owner: owner,
            multiSigners: multiSigners
        },
        data: exports.approveCheckedInstructionData.decode(data)
    };
}
exports.decodeApproveCheckedInstructionUnchecked = decodeApproveCheckedInstructionUnchecked;
