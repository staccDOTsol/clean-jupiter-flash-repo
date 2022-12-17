"use strict";
exports.__esModule = true;
exports.createAssociatedTokenAccountInstruction = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
/**
 * Construct an AssociatedTokenAccount instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param associatedToken          New associated token account
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, programId, associatedTokenProgramId) {
    if (programId === void 0) { programId = constants_1.TOKEN_PROGRAM_ID; }
    if (associatedTokenProgramId === void 0) { associatedTokenProgramId = constants_1.ASSOCIATED_TOKEN_PROGRAM_ID; }
    var keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedToken, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: associatedTokenProgramId,
        data: Buffer.alloc(0)
    });
}
exports.createAssociatedTokenAccountInstruction = createAssociatedTokenAccountInstruction;
