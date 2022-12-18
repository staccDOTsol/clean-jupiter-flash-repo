"use strict";
exports.__esModule = true;
exports.addSigners = void 0;
/** @internal */
function addSigners(keys, ownerOrAuthority, multiSigners) {
    if (multiSigners.length) {
        keys.push({ pubkey: ownerOrAuthority, isSigner: false, isWritable: false });
        for (var _i = 0, multiSigners_1 = multiSigners; _i < multiSigners_1.length; _i++) {
            var signer = multiSigners_1[_i];
            keys.push({ pubkey: signer.publicKey, isSigner: true, isWritable: false });
        }
    }
    else {
        keys.push({ pubkey: ownerOrAuthority, isSigner: true, isWritable: false });
    }
    return keys;
}
exports.addSigners = addSigners;
