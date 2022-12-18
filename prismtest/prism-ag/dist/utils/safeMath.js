"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullOrZero = exports.lte = exports.lt = exports.gte = exports.gt = exports.TokenAmount = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
// https://github.com/MikeMcl/bignumber.js
// https://blog.csdn.net/shenxianhui1995/article/details/103985434
class TokenAmount {
    constructor(wei, decimals = 0, isWei = true) {
        this.decimals = decimals;
        this._decimals = new bignumber_js_1.default(10).exponentiatedBy(decimals);
        if (isWei) {
            this.wei = new bignumber_js_1.default(wei);
        }
        else {
            this.wei = new bignumber_js_1.default(wei).multipliedBy(this._decimals);
        }
    }
    toEther() {
        return this.wei.dividedBy(this._decimals);
    }
    toWei() {
        return this.wei;
    }
    format() {
        const vaule = this.wei.dividedBy(this._decimals);
        return vaule.toFormat(vaule.isInteger() ? 0 : this.decimals);
    }
    fixed() {
        return this.wei.dividedBy(this._decimals).toFixed(this.decimals);
    }
    isNullOrZero() {
        return this.wei.isNaN() || this.wei.isZero();
    }
}
exports.TokenAmount = TokenAmount;
// >
function gt(a, b) {
    const valueA = new bignumber_js_1.default(a);
    const valueB = new bignumber_js_1.default(b);
    return valueA.isGreaterThan(valueB);
}
exports.gt = gt;
// >=
function gte(a, b) {
    const valueA = new bignumber_js_1.default(a);
    const valueB = new bignumber_js_1.default(b);
    return valueA.isGreaterThanOrEqualTo(valueB);
}
exports.gte = gte;
// <
function lt(a, b) {
    const valueA = new bignumber_js_1.default(a);
    const valueB = new bignumber_js_1.default(b);
    return valueA.isLessThan(valueB);
}
exports.lt = lt;
// <=
function lte(a, b) {
    const valueA = new bignumber_js_1.default(a);
    const valueB = new bignumber_js_1.default(b);
    return valueA.isLessThanOrEqualTo(valueB);
}
exports.lte = lte;
function isNullOrZero(value) {
    const amount = new bignumber_js_1.default(value);
    return amount.isNaN() || amount.isZero();
}
exports.isNullOrZero = isNullOrZero;
