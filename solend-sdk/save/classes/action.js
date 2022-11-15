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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolendAction = exports.POSITION_LIMIT = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const bn_js_1 = __importDefault(require("bn.js"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const axios_1 = __importDefault(require("axios"));
const obligation_1 = require("../state/obligation");
const instructions_1 = require("../instructions");
const constants_1 = require("./constants");
const reserve_1 = require("../state/reserve");
exports.POSITION_LIMIT = 6;
const API_ENDPOINT = "https://api.solend.fi";
const SOL_PADDING_FOR_INTEREST = "1000000";
function getTokenInfo(symbol, solendInfo) {
    const tokenInfo = solendInfo.reserves.find((reserve) => reserve.liquidityToken.symbol === symbol);
    if (!tokenInfo) {
        throw new Error(`Could not find ${symbol} in ASSETS`);
    }
    return tokenInfo;
}
class SolendAction {
    constructor(programId, connection, reserve, lendingMarket, publicKey, obligationAddress, obligationAccountInfo, userTokenAccountAddress, userCollateralAccountAddress, seed, symbol, positions, amount, depositReserves, borrowReserves, hostAta) {
        this.programId = programId;
        this.connection = connection;
        this.publicKey = publicKey;
        this.amount = new bn_js_1.default(amount);
        this.symbol = symbol;
        this.positions = positions;
        this.hostAta = hostAta;
        this.obligationAccountInfo = obligationAccountInfo;
        this.lendingMarket = lendingMarket;
        this.seed = seed;
        this.reserve = reserve;
        this.obligationAddress = obligationAddress;
        this.userTokenAccountAddress = userTokenAccountAddress;
        this.userCollateralAccountAddress = userCollateralAccountAddress;
        this.setupIxs = [];
        this.lendingIxs = [];
        this.cleanupIxs = [];
        this.preTxnIxs = [];
        this.postTxnIxs = [];
        this.depositReserves = depositReserves;
        this.borrowReserves = borrowReserves;
    }
    static initialize(action, amount, symbol, publicKey, connection, environment = "production", lendingMarketAddress, hostAta) {
        return __awaiter(this, void 0, void 0, function* () {
            const solendInfo = (yield (yield axios_1.default.get(`${API_ENDPOINT}/v1/markets/configs?scope=all&deployment=${environment}`)).data);
            let lendingMarket;
            const seed = lendingMarketAddress === null || lendingMarketAddress === void 0 ? void 0 : lendingMarketAddress.toBase58();
            const programId = (0, constants_1.getProgramId)(environment);
            const obligationAddress = yield web3_js_1.PublicKey.createWithSeed(publicKey, seed, programId);
            // @ts-ignore
            const reserve = lendingMarket.reserves.find((res) => res.liquidityToken.symbol === symbol);
            if (!reserve) {
                throw new Error(`Could not find asset ${symbol} in reserves`);
            }
            const obligationAccountInfo = yield connection.getAccountInfo(obligationAddress);
            let obligationDetails = null;
            const depositReserves = [];
            const borrowReserves = [];
            if (obligationAccountInfo) {
                obligationDetails = (0, obligation_1.parseObligation)(web3_js_1.PublicKey.default, obligationAccountInfo).info;
                obligationDetails.deposits.forEach((deposit) => {
                    depositReserves.push(deposit.depositReserve);
                });
                obligationDetails.borrows.forEach((borrow) => {
                    borrowReserves.push(borrow.borrowReserve);
                });
            }
            // Union of addresses
            const distinctReserveCount = [
                ...new Set([
                    ...borrowReserves.map((e) => e.toBase58()),
                    ...(action === "borrow" ? [reserve.address] : []),
                ]),
            ].length +
                [
                    ...new Set([
                        ...depositReserves.map((e) => e.toBase58()),
                        ...(action === "deposit" ? [reserve.address] : []),
                    ]),
                ].length;
            if (distinctReserveCount > exports.POSITION_LIMIT) {
                throw Error(`Obligation already has max number of positions: ${exports.POSITION_LIMIT}`);
            }
            // @ts-ignore
            const tokenInfo = getTokenInfo(symbol, lendingMarket);
            const userTokenAccountAddress = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(tokenInfo.liquidityToken.mint), publicKey);
            const userCollateralAccountAddress = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(reserve.collateralMintAddress), publicKey);
            return new SolendAction(programId, connection, reserve, 
            // @ts-ignore
            lendingMarket, publicKey, obligationAddress, obligationDetails, userTokenAccountAddress, userCollateralAccountAddress, seed, symbol, distinctReserveCount, amount, depositReserves, borrowReserves, hostAta);
        });
    }
    static buildDepositTxns(connection, amount, symbol, publicKey, environment = "production", lendingMarketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const axn = yield SolendAction.initialize("deposit", amount, symbol, publicKey, connection, environment, lendingMarketAddress);
            yield axn.addSupportIxs("deposit");
            yield axn.addDepositIx();
            return axn;
        });
    }
    static buildBorrowTxns(connection, amount, symbol, publicKey, environment = "production", hostAta, lendingMarketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const axn = yield SolendAction.initialize("borrow", amount, symbol, publicKey, connection, environment, lendingMarketAddress, hostAta);
            yield axn.addSupportIxs("borrow");
            yield axn.addBorrowIx();
            return axn;
        });
    }
    static buildDepositReserveLiquidityTxns(connection, amount, symbol, publicKey, environment = "production", lendingMarketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const axn = yield SolendAction.initialize("mint", amount, symbol, publicKey, connection, environment, lendingMarketAddress);
            yield axn.addSupportIxs("mint");
            yield axn.addDepositReserveLiquidityIx();
            return axn;
        });
    }
    static buildRedeemReserveCollateralTxns(connection, amount, symbol, publicKey, environment = "production", lendingMarketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const axn = yield SolendAction.initialize("redeem", amount, symbol, publicKey, connection, environment, lendingMarketAddress);
            yield axn.addSupportIxs("redeem");
            yield axn.addRedeemReserveCollateralIx();
            return axn;
        });
    }
    static buildDepositObligationCollateralTxns(connection, amount, symbol, publicKey, environment = "production", lendingMarketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const axn = yield SolendAction.initialize("depositCollateral", amount, symbol, publicKey, connection, environment, lendingMarketAddress);
            yield axn.addSupportIxs("depositCollateral");
            yield axn.addDepositObligationCollateralIx();
            return axn;
        });
    }
    static buildWithdrawTxns(connection, amount, symbol, publicKey, environment = "production", lendingMarketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const axn = yield SolendAction.initialize("withdraw", amount, symbol, publicKey, connection, environment, lendingMarketAddress);
            yield axn.addSupportIxs("withdraw");
            yield axn.addWithdrawIx();
            return axn;
        });
    }
    static buildRepayTxns(connection, amount, symbol, publicKey, environment = "production", lendingMarketAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const axn = yield SolendAction.initialize("repay", amount, symbol, publicKey, connection, environment, lendingMarketAddress);
            yield axn.addSupportIxs("repay");
            yield axn.addRepayIx();
            return axn;
        });
    }
    getTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const txns = {
                preLendingTxn: null,
                lendingTxn: null,
                postLendingTxn: null,
            };
            if (this.preTxnIxs.length) {
                txns.preLendingTxn = new web3_js_1.Transaction({
                    feePayer: this.publicKey,
                    recentBlockhash: (yield this.connection.getRecentBlockhash()).blockhash,
                }).add(...this.preTxnIxs);
            }
            txns.lendingTxn = new web3_js_1.Transaction({
                feePayer: this.publicKey,
                recentBlockhash: (yield this.connection.getRecentBlockhash()).blockhash,
            }).add(...this.setupIxs, ...this.lendingIxs, ...this.cleanupIxs);
            if (this.postTxnIxs.length) {
                txns.postLendingTxn = new web3_js_1.Transaction({
                    feePayer: this.publicKey,
                    recentBlockhash: (yield this.connection.getRecentBlockhash()).blockhash,
                }).add(...this.postTxnIxs);
            }
            return txns;
        });
    }
    sendTransactions(sendTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const txns = yield this.getTransactions();
            yield this.sendSingleTransaction(txns.preLendingTxn, sendTransaction);
            const signature = yield this.sendSingleTransaction(txns.lendingTxn, sendTransaction);
            yield this.sendSingleTransaction(txns.postLendingTxn, sendTransaction);
            return signature;
        });
    }
    sendSingleTransaction(txn, sendTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!txn)
                return "";
            const signature = yield sendTransaction(txn, this.connection);
            yield this.connection.confirmTransaction(signature);
            return signature;
        });
    }
    addDepositIx() {
        this.lendingIxs.push((0, instructions_1.depositReserveLiquidityAndObligationCollateralInstruction)(this.amount, this.userTokenAccountAddress, this.userCollateralAccountAddress, new web3_js_1.PublicKey(this.reserve.address), new web3_js_1.PublicKey(this.reserve.liquidityAddress), new web3_js_1.PublicKey(this.reserve.collateralMintAddress), new web3_js_1.PublicKey(this.lendingMarket.address), new web3_js_1.PublicKey(this.lendingMarket.authorityAddress), new web3_js_1.PublicKey(this.reserve.collateralSupplyAddress), // destinationCollateral
        this.obligationAddress, // obligation
        this.publicKey, // obligationOwner
        new web3_js_1.PublicKey(this.reserve.pythOracle), new web3_js_1.PublicKey(this.reserve.switchboardOracle), this.publicKey, // transferAuthority
        this.programId));
    }
    addDepositReserveLiquidityIx() {
        this.lendingIxs.push((0, instructions_1.depositReserveLiquidityInstruction)(this.amount, this.userTokenAccountAddress, this.userCollateralAccountAddress, new web3_js_1.PublicKey(this.reserve.address), new web3_js_1.PublicKey(this.reserve.liquidityAddress), new web3_js_1.PublicKey(this.reserve.collateralMintAddress), new web3_js_1.PublicKey(this.lendingMarket.address), new web3_js_1.PublicKey(this.lendingMarket.authorityAddress), this.publicKey, // transferAuthority
        this.programId));
    }
    addRedeemReserveCollateralIx() {
        this.lendingIxs.push((0, instructions_1.redeemReserveCollateralInstruction)(this.amount, this.userCollateralAccountAddress, this.userTokenAccountAddress, new web3_js_1.PublicKey(this.reserve.address), new web3_js_1.PublicKey(this.reserve.collateralMintAddress), new web3_js_1.PublicKey(this.reserve.liquidityAddress), new web3_js_1.PublicKey(this.lendingMarket.address), // lendingMarket
        new web3_js_1.PublicKey(this.lendingMarket.authorityAddress), // lendingMarketAuthority
        this.publicKey, // transferAuthority
        this.programId));
    }
    addDepositObligationCollateralIx() {
        this.lendingIxs.push((0, instructions_1.depositObligationCollateralInstruction)(this.amount, this.userCollateralAccountAddress, new web3_js_1.PublicKey(this.reserve.collateralSupplyAddress), new web3_js_1.PublicKey(this.reserve.address), this.obligationAddress, // obligation
        new web3_js_1.PublicKey(this.lendingMarket.address), this.publicKey, // obligationOwner
        this.publicKey, // transferAuthority
        this.programId));
    }
    addBorrowIx() {
        this.lendingIxs.push((0, instructions_1.borrowObligationLiquidityInstruction)(this.amount, new web3_js_1.PublicKey(this.reserve.liquidityAddress), this.userTokenAccountAddress, new web3_js_1.PublicKey(this.reserve.address), new web3_js_1.PublicKey(this.reserve.liquidityFeeReceiverAddress), this.obligationAddress, new web3_js_1.PublicKey(this.lendingMarket.address), // lendingMarket
        new web3_js_1.PublicKey(this.lendingMarket.authorityAddress), // lendingMarketAuthority
        this.publicKey, this.programId, this.hostAta));
    }
    addWithdrawIx() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.connection.getAccountInfo(new web3_js_1.PublicKey(this.reserve.address), "processed");
            if (!buffer) {
                throw Error(`Unable to fetch reserve data for ${this.reserve.liquidityToken.name}`);
            }
            const parsedData = (_a = (0, reserve_1.parseReserve)(new web3_js_1.PublicKey(this.reserve.address), buffer)) === null || _a === void 0 ? void 0 : _a.info;
            if (!parsedData) {
                throw Error(`Unable to parse data of reserve ${this.reserve.liquidityToken.name}`);
            }
            const totalBorrowsWads = parsedData.liquidity.borrowedAmountWads;
            const totalLiquidityWads = parsedData.liquidity.availableAmount.mul(new bn_js_1.default(constants_1.WAD));
            const totalDepositsWads = totalBorrowsWads.add(totalLiquidityWads);
            const cTokenExchangeRate = new bignumber_js_1.default(totalDepositsWads.toString())
                .div(parsedData.collateral.mintTotalSupply.toString())
                .div(constants_1.WAD);
            this.lendingIxs.push((0, instructions_1.withdrawObligationCollateralAndRedeemReserveLiquidity)(this.amount.eq(new bn_js_1.default(constants_1.U64_MAX))
                ? this.amount
                : new bn_js_1.default(new bignumber_js_1.default(this.amount.toString())
                    .dividedBy(cTokenExchangeRate)
                    .integerValue(bignumber_js_1.default.ROUND_FLOOR)
                    .toString()), new web3_js_1.PublicKey(this.reserve.collateralSupplyAddress), this.userCollateralAccountAddress, new web3_js_1.PublicKey(this.reserve.address), this.obligationAddress, new web3_js_1.PublicKey(this.lendingMarket.address), new web3_js_1.PublicKey(this.lendingMarket.authorityAddress), this.userTokenAccountAddress, // destinationLiquidity
            new web3_js_1.PublicKey(this.reserve.collateralMintAddress), new web3_js_1.PublicKey(this.reserve.liquidityAddress), this.publicKey, // obligationOwner
            this.publicKey, // transferAuthority
            this.programId));
        });
    }
    addRepayIx() {
        return __awaiter(this, void 0, void 0, function* () {
            this.lendingIxs.push((0, instructions_1.repayObligationLiquidityInstruction)(this.amount, this.userTokenAccountAddress, new web3_js_1.PublicKey(this.reserve.liquidityAddress), new web3_js_1.PublicKey(this.reserve.address), this.obligationAddress, new web3_js_1.PublicKey(this.lendingMarket.address), this.publicKey, this.programId));
        });
    }
    addSupportIxs(action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (["withdraw", "borrow"].includes(action)) {
                yield this.addRefreshIxs();
            }
            if (!["mint", "redeem"].includes(action)) {
                yield this.addObligationIxs();
            }
            yield this.addAtaIxs(action);
        });
    }
    addRefreshIxs() {
        return __awaiter(this, void 0, void 0, function* () {
            // Union of addresses
            const allReserveAddresses = [
                ...new Set([
                    ...this.depositReserves.map((e) => e.toBase58()),
                    ...this.borrowReserves.map((e) => e.toBase58()),
                    this.reserve.address,
                ]),
            ];
            allReserveAddresses.forEach((reserveAddress) => {
                const reserveInfo = this.lendingMarket.reserves.find((reserve) => reserve.address === reserveAddress);
                if (!reserveInfo) {
                    throw new Error(`Could not find asset ${reserveAddress} in reserves`);
                }
                const refreshReserveIx = (0, instructions_1.refreshReserveInstruction)(new web3_js_1.PublicKey(reserveAddress), this.programId, new web3_js_1.PublicKey(this.reserve.pythOracle), new web3_js_1.PublicKey(this.reserve.switchboardOracle));
                this.setupIxs.push(refreshReserveIx);
            });
            const refreshObligationIx = (0, instructions_1.refreshObligationInstruction)(this.obligationAddress, this.depositReserves, this.borrowReserves, this.programId);
            this.setupIxs.push(refreshObligationIx);
        });
    }
    addObligationIxs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.obligationAccountInfo) {
                const obligationAccountInfoRentExempt = yield this.connection.getMinimumBalanceForRentExemption(obligation_1.OBLIGATION_SIZE);
                this.setupIxs.push(web3_js_1.SystemProgram.createAccountWithSeed({
                    fromPubkey: this.publicKey,
                    newAccountPubkey: this.obligationAddress,
                    basePubkey: this.publicKey,
                    seed: this.seed,
                    lamports: obligationAccountInfoRentExempt,
                    space: obligation_1.OBLIGATION_SIZE,
                    programId: this.programId,
                }));
                const initObligationIx = (0, instructions_1.initObligationInstruction)(this.obligationAddress, new web3_js_1.PublicKey(this.lendingMarket.address), this.publicKey, this.programId);
                this.setupIxs.push(initObligationIx);
            }
        });
    }
    addAtaIxs(action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.symbol === "SOL") {
                yield this.updateWSOLAccount(action);
            }
            if ((action === "withdraw" || action === "borrow" || action === "redeem") &&
                this.symbol !== "SOL") {
                const userTokenAccountInfo = yield this.connection.getAccountInfo(this.userTokenAccountAddress);
                if (!userTokenAccountInfo) {
                    const createUserTokenAccountIx = spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(this.reserve.liquidityToken.mint), this.userTokenAccountAddress, this.publicKey, this.publicKey);
                    if (this.positions === exports.POSITION_LIMIT && this.hostAta) {
                        this.preTxnIxs.push(createUserTokenAccountIx);
                    }
                    else {
                        this.setupIxs.push(createUserTokenAccountIx);
                    }
                }
            }
            if (action === "withdraw" || action === "mint" || action === "deposit") {
                const userCollateralAccountInfo = yield this.connection.getAccountInfo(this.userCollateralAccountAddress);
                if (!userCollateralAccountInfo) {
                    const createUserCollateralAccountIx = spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(this.reserve.collateralMintAddress), this.userCollateralAccountAddress, this.publicKey, this.publicKey);
                    if (this.positions === exports.POSITION_LIMIT && this.symbol === "SOL") {
                        this.preTxnIxs.push(createUserCollateralAccountIx);
                    }
                    else {
                        this.setupIxs.push(createUserCollateralAccountIx);
                    }
                }
            }
        });
    }
    updateWSOLAccount(action) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const preIxs = [];
            const postIxs = [];
            let safeRepay = new bn_js_1.default(this.amount);
            if (this.obligationAccountInfo &&
                action === "repay" &&
                this.amount.eq(new bn_js_1.default(constants_1.U64_MAX))) {
                const buffer = yield this.connection.getAccountInfo(new web3_js_1.PublicKey(this.reserve.address), "processed");
                if (!buffer) {
                    throw Error(`Unable to fetch reserve data for ${this.reserve.liquidityToken.name}`);
                }
                const parsedData = (_a = (0, reserve_1.parseReserve)(new web3_js_1.PublicKey(this.reserve.address), buffer)) === null || _a === void 0 ? void 0 : _a.info;
                if (!parsedData) {
                    throw Error(`Unable to parse data of reserve ${this.reserve.liquidityToken.name}`);
                }
                const borrow = this.obligationAccountInfo.borrows.find((borrow) => borrow.borrowReserve.toBase58() === this.reserve.address);
                if (!borrow) {
                    throw Error(`Unable to find obligation borrow to repay for ${this.obligationAccountInfo.owner.toBase58()}`);
                }
                safeRepay = new bn_js_1.default(Math.floor(new bignumber_js_1.default(borrow.borrowedAmountWads.toString())
                    .multipliedBy(parsedData.liquidity.cumulativeBorrowRateWads.toString())
                    .dividedBy(borrow.cumulativeBorrowRateWads.toString())
                    .dividedBy(constants_1.WAD)
                    .plus(SOL_PADDING_FOR_INTEREST)
                    .toNumber()).toString());
            }
            const userWSOLAccountInfo = yield this.connection.getAccountInfo(this.userTokenAccountAddress);
            const rentExempt = yield spl_token_1.Token.getMinBalanceRentForExemptAccount(this.connection);
            const sendAction = action === "deposit" || action === "repay" || action === "mint";
            const transferLamportsIx = web3_js_1.SystemProgram.transfer({
                fromPubkey: this.publicKey,
                toPubkey: this.userTokenAccountAddress,
                lamports: (userWSOLAccountInfo ? 0 : rentExempt) +
                    (sendAction ? parseInt(safeRepay.toString(), 10) : 0),
            });
            preIxs.push(transferLamportsIx);
            const closeWSOLAccountIx = spl_token_1.Token.createCloseAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, this.userTokenAccountAddress, this.publicKey, this.publicKey, []);
            if (userWSOLAccountInfo) {
                const syncIx = (0, instructions_1.syncNative)(this.userTokenAccountAddress);
                if (sendAction) {
                    preIxs.push(syncIx);
                }
                else {
                    postIxs.push(closeWSOLAccountIx);
                }
            }
            else {
                const createUserWSOLAccountIx = spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.NATIVE_MINT, this.userTokenAccountAddress, this.publicKey, this.publicKey);
                preIxs.push(createUserWSOLAccountIx);
                postIxs.push(closeWSOLAccountIx);
            }
            if (this.positions && this.positions >= exports.POSITION_LIMIT) {
                this.preTxnIxs.push(...preIxs);
                this.postTxnIxs.push(...postIxs);
            }
            else {
                this.setupIxs.push(...preIxs);
                this.cleanupIxs.push(...postIxs);
            }
        });
    }
}
exports.SolendAction = SolendAction;
