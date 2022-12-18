"use strict";
exports.__esModule = true;
exports.decodeInitializeMintInstructionUnchecked = exports.decodeInitializeMintInstruction = exports.createInitializeMintInstruction = exports.initializeMintInstructionData = void 0;
var buffer_layout_1 = require("@solana/buffer-layout");
var buffer_layout_utils_1 = require("@solana/buffer-layout-utils");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var types_1 = require("./types");
/** TODO: docs */
exports.initializeMintInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_1.u8)('decimals'),
    (0, buffer_layout_utils_1.publicKey)('mintAuthority'),
    (0, buffer_layout_1.u8)('freezeAuthorityOption'),
    (0, buffer_layout_utils_1.publicKey)('freezeAuthority'),
]);
/**
 * Construct an InitializeMint instruction
 *
 * @param mint            Token mint account
 * @param decimals        Number of decimals in token account amounts
 * @param mintAuthority   Minting authority
 * @param freezeAuthority Optional authority that can freeze token accounts
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createInitializeMintInstruction(mint, decimals, mintAuthority, freezeAuthority, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    var keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    var data = Buffer.alloc(exports.initializeMintInstructionData.span);
    exports.initializeMintInstructionData.encode({
        instruction: types_1.TokenInstruction.InitializeMint,
        decimals: decimals,
        mintAuthority: mintAuthority,
        freezeAuthorityOption: freezeAuthority ? 1 : 0,
        freezeAuthority: freezeAuthority || new web3_js_1.PublicKey(0)
    }, data);
    return new web3_js_1.TransactionInstruction({ keys: keys, programId: programId, data: data });
}
exports.createInitializeMintInstruction = createInitializeMintInstruction;
/**
 * Decode an InitializeMint instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeInitializeMintInstruction(instruction, programId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (!instruction.programId.equals(programId))
        throw new errors_1.TokenInvalidInstructionProgramError();
    if (instruction.data.length !== exports.initializeMintInstructionData.span)
        throw new errors_1.TokenInvalidInstructionDataError();
    var _a = decodeInitializeMintInstructionUnchecked(instruction), _b = _a.keys, mint = _b.mint, rent = _b.rent, data = _a.data;
    if (data.instruction !== types_1.TokenInstruction.InitializeMint)
        throw new errors_1.TokenInvalidInstructionTypeError();
    if (!mint || !rent)
        throw new errors_1.TokenInvalidInstructionKeysError();
    // TODO: key checks?
    return {
        programId: programId,
        keys: {
            mint: mint,
            rent: rent
        },
        data: data
    };
}
exports.decodeInitializeMintInstruction = decodeInitializeMintInstruction;
/**
 * Decode an InitializeMint instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeInitializeMintInstructionUnchecked(_a) {
    var programId = _a.programId, _b = _a.keys, mint = _b[0], rent = _b[1], data = _a.data;
    var _c = exports.initializeMintInstructionData.decode(data), instruction = _c.instruction, decimals = _c.decimals, mintAuthority = _c.mintAuthority, freezeAuthorityOption = _c.freezeAuthorityOption, freezeAuthority = _c.freezeAuthority;
    return {
        programId: programId,
        keys: {
            mint: mint,
            rent: rent
        },
        data: {
            instruction: instruction,
            decimals: decimals,
            mintAuthority: mintAuthority,
            freezeAuthority: freezeAuthorityOption ? freezeAuthority : null
        }
    };
}
exports.decodeInitializeMintInstructionUnchecked = decodeInitializeMintInstructionUnchecked;
