"use strict";
exports.__esModule = true;
exports.decodeSetAuthorityInstructionUnchecked = exports.decodeSetAuthorityInstruction = exports.createSetAuthorityInstruction = exports.setAuthorityInstructionData = exports.AuthorityType = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var internal_1 = require("./internal");
var types_1 = require("./types");
/** Authority types defined by the program */
var AuthorityType;
(function (AuthorityType) {
    AuthorityType[AuthorityType["MintTokens"] = 0] = "MintTokens";
    AuthorityType[AuthorityType["FreezeAccount"] = 1] = "FreezeAccount";
    AuthorityType[AuthorityType["AccountOwner"] = 2] = "AccountOwner";
    AuthorityType[AuthorityType["CloseAccount"] = 3] = "CloseAccount";
})(AuthorityType = exports.AuthorityType || (exports.AuthorityType = {}));
/** TODO: docs */
exports.setAuthorityInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_1.u8)('authorityType'),
    (0, buffer_layout_1.u8)('newAuthorityOption'),
    (0, buffer_layout_utils_1.publicKey)('newAuthority'),
]);
/**
 * Construct a SetAuthority instruction
 *
 * @param account          Address of the token account
 * @param currentAuthority Current authority of the specified type
 * @param authorityType    Type of authority to set
 * @param newAuthority     New authority of the account
 * @param multiSigners     Signing accounts if `currentAuthority` is a multisig
 * @param programId        SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createSetAuthorityInstruction(account, currentAuthority, authorityType, newAuthority, multiSigners, programId) {
    if (multiSigners === void 0) { multiSigners = []; }
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = (0, internal_1.addSigners)([{ pubkey: account, isSigner: false, isWritable: true }], currentAuthority, multiSigners);
    var data = Buffer.alloc(exports.setAuthorityInstructionData.span);
    exports.setAuthorityInstructionData.encode({
        instruction: types_1.TokenInstruction.SetAuthority,
        authorityType: authorityType,
        newAuthorityOption: newAuthority ? 1 : 0,
        newAuthority: newAuthority || new web3_js_1.PublicKey(0)
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createSetAuthorityInstruction = createSetAuthorityInstruction;
/**
 * Decode a SetAuthority instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeSetAuthorityInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.setAuthorityInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeSetAuthorityInstructionUnchecked(instruction), _b = _a.keys, account = _b.account, currentAuthority = _b.currentAuthority, multiSigners = _b.multiSigners, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.SetAuthority)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!account || !currentAuthority)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            account: account,
            currentAuthority: currentAuthority,
            multiSigners: multiSigners
        },
        data: data
    };
}
exports.decodeSetAuthorityInstruction = decodeSetAuthorityInstruction;
/**
 * Decode a SetAuthority instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeSetAuthorityInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, account = _b[0], currentAuthority = _b[1], multiSigners = _b.slice(2), data = _a.data;
    var _c = exports.setAuthorityInstructionData.decode(data), instruction = _c.instruction, authorityType = _c.authorityType, newAuthorityOption = _c.newAuthorityOption, newAuthority = _c.newAuthority;
    return {
        programId: programId,
        keys: {
            account: account,
            currentAuthority: currentAuthority,
            multiSigners: multiSigners
        },
        data: {
            instruction: instruction,
            authorityType: authorityType,
            newAuthority: newAuthorityOption ? newAuthority : null
        }
    };
}
exports.decodeSetAuthorityInstructionUnchecked = decodeSetAuthorityInstructionUnchecked;
