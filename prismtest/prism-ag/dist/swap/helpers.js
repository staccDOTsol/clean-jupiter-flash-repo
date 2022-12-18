"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMeta = exports.applyBlockHashAndPartialSign = exports.generateFeesAccount = exports.prepareAccounts = exports.getTokenAccountAddressByMint = exports.createAssociatedTokenAccountIfNotExist = exports.createTokenAccountIfNotExist = exports.createProgramAccountIfNotExist = exports.createSyncNativeInstruction = void 0;
const token_instructions_1 = require("@project-serum/serum/lib/token-instructions");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("@project-serum/borsh");
const types_1 = require("../types/types");
function createSyncNativeInstruction(nativeAccount) {
    const dataLayout = (0, borsh_1.struct)([
        (0, borsh_1.u8)("instruction"),
    ]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 17, // SyncNative instruction
    }, data);
    const keys = [{ pubkey: nativeAccount, isSigner: false, isWritable: true }];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: spl_token_1.TOKEN_PROGRAM_ID,
        data,
    });
}
exports.createSyncNativeInstruction = createSyncNativeInstruction;
function createProgramAccountIfNotExist(connection, account, owner, programId, lamports, layout, transaction, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        let publicKey;
        if (account) {
            publicKey = new web3_js_1.PublicKey(account);
        }
        else {
            const newAccount = new web3_js_1.Account();
            publicKey = newAccount.publicKey;
            transaction.add(web3_js_1.SystemProgram.createAccount({
                fromPubkey: owner,
                newAccountPubkey: publicKey,
                lamports: lamports !== null && lamports !== void 0 ? lamports : (yield connection.getMinimumBalanceForRentExemption(layout.span)),
                space: layout.span,
                programId
            }));
            signer.push(newAccount);
        }
        return publicKey;
    });
}
exports.createProgramAccountIfNotExist = createProgramAccountIfNotExist;
function createTokenAccountIfNotExist(connection, account, owner, mintAddress, lamports, transaction, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        let publicKey;
        if (account) {
            publicKey = new web3_js_1.PublicKey(account);
        }
        else {
            publicKey = yield createProgramAccountIfNotExist(connection, account, owner, spl_token_1.TOKEN_PROGRAM_ID, lamports, types_1.ACCOUNT_LAYOUT, transaction, signer);
            transaction.add((0, token_instructions_1.initializeAccount)({
                account: publicKey,
                mint: new web3_js_1.PublicKey(mintAddress),
                owner
            }));
        }
        return publicKey;
    });
}
exports.createTokenAccountIfNotExist = createTokenAccountIfNotExist;
function createAssociatedTokenAccountIfNotExist(account, owner, mintAddress, connection, transaction, atas = []) {
    return __awaiter(this, void 0, void 0, function* () {
        let publicKey;
        if (account) {
            publicKey = new web3_js_1.PublicKey(account);
        }
        const mint = new web3_js_1.PublicKey(mintAddress);
        // @ts-ignore without ts ignore, yarn build will failed
        const ata = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, owner, true);
        const infoAta = yield connection.getAccountInfo(ata);
        if ((!publicKey || !ata.equals(publicKey)) && !atas.includes(ata.toBase58()) && !infoAta) {
            transaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(new web3_js_1.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'), spl_token_1.TOKEN_PROGRAM_ID, mint, ata, owner, owner));
            atas.push(ata.toBase58());
        }
        return ata;
    });
}
exports.createAssociatedTokenAccountIfNotExist = createAssociatedTokenAccountIfNotExist;
function getTokenAccountAddressByMint(accounts, coin) {
    if (!coin)
        return null;
    for (let i = 0; i < accounts.length; i++)
        if (accounts[i].mint == coin.mintAddress)
            return accounts[i].address;
    return null;
}
exports.getTokenAccountAddressByMint = getTokenAccountAddressByMint;
function prepareAccounts(user, userAccounts, connection, route, preTransaction, preSigners, postTransaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromCoin, midCoin, toCoin } = route.routeData;
        let midAccount = getTokenAccountAddressByMint(userAccounts, midCoin);
        let fromAccount = getTokenAccountAddressByMint(userAccounts, fromCoin);
        let toAccount = getTokenAccountAddressByMint(userAccounts, toCoin);
        if (fromCoin.mintAddress === "So11111111111111111111111111111111111111112") {
            fromAccount = yield createAssociatedTokenAccountIfNotExist(fromAccount, user, fromCoin.mintAddress, connection, preTransaction);
            preTransaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: user,
                toPubkey: fromAccount,
                lamports: route.amountIn * 1e9 + 1e7, // 1 sol
            }));
            preTransaction.add(createSyncNativeInstruction(fromAccount));
            postTransaction.add((0, token_instructions_1.closeAccount)({
                source: fromAccount,
                destination: user,
                owner: user
            }));
        }
        else
            fromAccount = yield createAssociatedTokenAccountIfNotExist(fromAccount, user, fromCoin.mintAddress, connection, preTransaction);
        if (toCoin.mintAddress === "So11111111111111111111111111111111111111112") {
            toAccount = yield createAssociatedTokenAccountIfNotExist(toAccount, user, toCoin.mintAddress, connection, preTransaction);
            postTransaction.add((0, token_instructions_1.closeAccount)({
                source: toAccount,
                destination: user,
                owner: user
            }));
        }
        else
            toAccount = yield createAssociatedTokenAccountIfNotExist(toAccount, user, toCoin.mintAddress, connection, preTransaction);
        if (midCoin) {
            if (midCoin.mintAddress === "So11111111111111111111111111111111111111112") {
                midAccount = yield createAssociatedTokenAccountIfNotExist(midAccount, user, midCoin.mintAddress, connection, preTransaction);
                postTransaction.add((0, token_instructions_1.closeAccount)({
                    source: midAccount,
                    destination: user,
                    owner: user,
                }));
            }
            else
                midAccount = yield createAssociatedTokenAccountIfNotExist(midAccount, user, midCoin.mintAddress, connection, preTransaction);
        }
        return {
            fromTokenAccount: fromAccount,
            midTokenAccount: midAccount,
            toTokenAccount: toAccount,
        };
    });
}
exports.prepareAccounts = prepareAccounts;
function generateFeesAccount(connection, settings, user, mint, preTransaction, route) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mint)
            return null;
        let owner = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(mint), settings.owner.publicKey);
        const info = yield connection.getAccountInfo(owner);
        if (!info) {
            preTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(mint), owner, settings.owner.publicKey, user));
        }
        let host = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(mint), settings.host.publicKey);
        if (!settings.host.publicKey.equals(settings.owner.publicKey)) {
            const infoHost = yield connection.getAccountInfo(host);
            if (!infoHost) {
                preTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(mint), host, settings.host.publicKey, user));
            }
        }
        if (route.provider == "symmetry") {
            let symmetryInfo = route.routeData.symmetryInfo;
            let swapAccounts = symmetryInfo.swapAccounts;
            let swapFeeAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, swapAccounts.fees.smfWallet);
            let hostFeeAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, swapAccounts.fees.hostWallet);
            let managerFeeAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, swapAccounts.fees.managerWallet);
            if (!swapFeeAccount.equals(owner) && !swapFeeAccount.equals(host)) {
                const infoHost = yield connection.getAccountInfo(swapFeeAccount);
                if (!infoHost) {
                    preTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, swapFeeAccount, swapAccounts.fees.smfWallet, user));
                }
            }
            if (!hostFeeAccount.equals(owner) && !hostFeeAccount.equals(host) && !hostFeeAccount.equals(swapFeeAccount)) {
                const infoHost = yield connection.getAccountInfo(hostFeeAccount);
                if (!infoHost) {
                    preTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, hostFeeAccount, swapAccounts.fees.hostWallet, user));
                }
            }
            if (!managerFeeAccount.equals(owner) && !managerFeeAccount.equals(host) && !managerFeeAccount.equals(swapFeeAccount) && !managerFeeAccount.equals(hostFeeAccount)) {
                const infoHost = yield connection.getAccountInfo(managerFeeAccount);
                if (!infoHost) {
                    preTransaction.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, swapAccounts.fees.feeTokenMint, managerFeeAccount, swapAccounts.fees.managerWallet, user));
                }
            }
        }
        return {
            owner: owner,
            host: host,
        };
    });
}
exports.generateFeesAccount = generateFeesAccount;
function applyBlockHashAndPartialSign(connection, wallet, preTransaction, transaction, postTransaction, preSigners, signers) {
    return __awaiter(this, void 0, void 0, function* () {
        let { blockhash } = yield connection.getRecentBlockhash('processed');
        let result = [];
        let txIndex = 0;
        if (preTransaction.instructions.length > 0) {
            txIndex = 1;
            preTransaction.recentBlockhash = blockhash;
            preTransaction.feePayer = wallet.publicKey;
            preTransaction.setSigners(wallet.publicKey, ...preSigners.map((s) => s.publicKey));
            if (preSigners.length > 0)
                preTransaction.partialSign(...preSigners);
            result.push(preTransaction);
        }
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
        transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
        if (signers.length > 0)
            transaction.partialSign(...signers);
        result.push(transaction);
        if (postTransaction.instructions.length > 0) {
            postTransaction.recentBlockhash = blockhash;
            postTransaction.feePayer = wallet.publicKey;
            postTransaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));
            if (signers.length > 0)
                postTransaction.partialSign(...signers);
            result.push(postTransaction);
        }
        return {
            txIndex: txIndex,
            transactions: result
        };
    });
}
exports.applyBlockHashAndPartialSign = applyBlockHashAndPartialSign;
function parseMeta(response, txId, swapResult) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fromMint, toMint, midMint, from, to, mid } = swapResult;
        let meta = response.meta;
        if (response.meta.err)
            return {
                status: "Error",
                error: response.meta.err,
            };
        let { postBalances, preTokenBalances, postTokenBalances } = meta;
        let maxFrom = 0;
        let maxTo = 0;
        let balances = [];
        for (let i = 0; i < postBalances.length; i++)
            balances.push({ pre: 0, post: 0, mint: "" });
        for (let i = 0; i < preTokenBalances.length; i++) {
            balances[preTokenBalances[i].accountIndex].pre = preTokenBalances[i].uiTokenAmount.uiAmount;
            balances[preTokenBalances[i].accountIndex].mint = preTokenBalances[i].mint;
        }
        for (let i = 0; i < postTokenBalances.length; i++) {
            balances[postTokenBalances[i].accountIndex].post = postTokenBalances[i].uiTokenAmount.uiAmount;
            balances[postTokenBalances[i].accountIndex].mint = postTokenBalances[i].mint;
        }
        for (let i = 0; i < postBalances.length; i++) {
            if (balances[i].mint == fromMint && balances[i].post - balances[i].pre < maxFrom)
                maxFrom = balances[i].post - balances[i].pre;
            if (balances[i].mint == toMint && balances[i].post - balances[i].pre > maxTo)
                maxTo = balances[i].post - balances[i].pre;
        }
        return {
            status: "Parsed",
            from: from,
            to: to,
            fromAmount: parseFloat((-maxFrom.toFixed(9)).toString()),
            fromMint: fromMint,
            toAmount: parseFloat(maxTo.toFixed(9).toString()),
            toMint: toMint,
            rateA: parseFloat(((maxFrom == 0 ? 0 : -maxTo / maxFrom).toFixed(9)).toString()),
            rateB: parseFloat((maxTo == 0 ? 0 : -maxFrom / maxTo).toFixed(9).toString()),
            txId: txId,
        };
    });
}
exports.parseMeta = parseMeta;
