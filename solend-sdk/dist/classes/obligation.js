"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolendObligation = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const bn_js_1 = __importDefault(require("bn.js"));
const constants_1 = require("./constants");
class SolendObligation {
    constructor(walletAddress, obligationAddress, obligation, reserves) {
        this.walletAddress = walletAddress;
        this.obligationAddress = obligationAddress;
        const positionDetails = this.calculatePositions(obligation, reserves);
        this.deposits = positionDetails.deposits;
        this.borrows = positionDetails.borrows;
        this.obligationStats = positionDetails.stats;
    }
    calculatePositions(obligation, reserves) {
        let userTotalDeposit = new bignumber_js_1.default(0);
        let borrowLimit = new bignumber_js_1.default(0);
        let liquidationThreshold = new bignumber_js_1.default(0);
        let positions = 0;
        const deposits = obligation.deposits.map((deposit) => {
            const reserve = reserves.find((reserve) => reserve.address === deposit.depositReserve.toBase58());
            const loanToValue = reserve.stats.loanToValueRatio;
            const liqThreshold = reserve.stats.liquidationThreshold;
            const supplyAmount = new bn_js_1.default(Math.floor(new bignumber_js_1.default(deposit.depositedAmount.toString())
                .multipliedBy(reserve.stats.cTokenExchangeRate)
                .toNumber()));
            const supplyAmountUSD = new bignumber_js_1.default(supplyAmount.toString())
                .multipliedBy(reserve.stats.assetPriceUSD)
                .dividedBy("1".concat(Array(reserve.stats.decimals + 1).join("0")));
            userTotalDeposit = userTotalDeposit.plus(supplyAmountUSD);
            borrowLimit = borrowLimit.plus(supplyAmountUSD.multipliedBy(loanToValue));
            liquidationThreshold = liquidationThreshold.plus(supplyAmountUSD.multipliedBy(liqThreshold));
            if (!supplyAmount.eq(new bn_js_1.default("0"))) {
                positions += 1;
            }
            return {
                mintAddress: reserve.config.liquidityToken.mint,
                amount: supplyAmount,
            };
        });
        let userTotalBorrow = new bignumber_js_1.default(0);
        const borrows = obligation.borrows.map((borrow) => {
            const reserve = reserves.find((reserve) => reserve.address === borrow.borrowReserve.toBase58());
            const borrowAmount = new bn_js_1.default(Math.floor(new bignumber_js_1.default(borrow.borrowedAmountWads.toString())
                .multipliedBy(reserve.stats.cumulativeBorrowRateWads.toString())
                .dividedBy(borrow.cumulativeBorrowRateWads.toString())
                .dividedBy(constants_1.WAD)
                .toNumber()).toString());
            const borrowAmountUSD = new bignumber_js_1.default(borrowAmount.toString())
                .multipliedBy(reserve.stats.assetPriceUSD)
                .dividedBy("1".concat(Array(reserve.stats.decimals + 1).join("0")));
            if (!borrowAmount.eq(new bn_js_1.default("0"))) {
                positions += 1;
            }
            userTotalBorrow = userTotalBorrow.plus(borrowAmountUSD);
            return {
                mintAddress: reserve.config.liquidityToken.mint,
                amount: borrowAmount,
            };
        });
        return {
            deposits,
            borrows,
            stats: {
                liquidationThreshold: liquidationThreshold.toNumber(),
                userTotalDeposit: userTotalDeposit.toNumber(),
                userTotalBorrow: userTotalBorrow.toNumber(),
                borrowLimit: borrowLimit.toNumber(),
                borrowUtilization: userTotalBorrow.dividedBy(borrowLimit).toNumber(),
                netAccountValue: userTotalDeposit.minus(userTotalBorrow).toNumber(),
                positions,
            },
        };
    }
}
exports.SolendObligation = SolendObligation;
