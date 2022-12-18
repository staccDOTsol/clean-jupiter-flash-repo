"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let JSBI = require('jsbi');
let ZERO = JSBI.BigInt(0);
let ONE = JSBI.BigInt(1);
let TWO = JSBI.BigInt(2);
function abs(number) {
    return JSBI.GE(number, ZERO) ? number : JSBI.unaryMinus(number);
}
function arraySum(numbers) {
    let sum = ZERO;
    for (let i = 0; i < numbers.length; i++) {
        sum = JSBI.add(sum, numbers[i]);
    }
    return sum;
}
// stable curve implementation for more than 2 tokens
let StableCurve = function () {
    function StableCurve(numOfTokens, amp, targetPrices) {
        this.numOfTokens = void 0;
        this.amp = void 0;
        this.targetPrices = void 0;
        this.numOfTokens = numOfTokens;
        this.amp = amp;
        this.targetPrices = targetPrices;
    }
    let proto = StableCurve.prototype;
    proto.mulTarget = function mulTarget(tokenAmounts) {
        let arr = [];
        for (let i = 0; i < JSBI.toNumber(this.numOfTokens); i++) {
            arr.push(JSBI.multiply(tokenAmounts[i], this.targetPrices[i]));
        }
        return arr;
    };
    proto.swap = function swap(tokenAmounts, inputIndex, outputIndex, amount, subtractOne) {
        if (subtractOne === void 0)
            subtractOne = true;
        let mulTarget = this.mulTarget(tokenAmounts);
        let x = JSBI.add(mulTarget[inputIndex], JSBI.multiply(amount, this.targetPrices[inputIndex]));
        let dy = JSBI.subtract(mulTarget[outputIndex], this.computeY(tokenAmounts, inputIndex, outputIndex, x));
        if (subtractOne)
            dy = JSBI.subtract(dy, ONE);
        return JSBI.divide(dy, this.targetPrices[outputIndex]);
    };
    proto.computeD = function computeD(tokenAmounts) {
        let dPrev = ZERO;
        let mulTarget = this.mulTarget(tokenAmounts);
        let sum = arraySum(mulTarget);
        let d = sum;
        let ampXnum = JSBI.multiply(this.amp, this.numOfTokens);
        let num = 0;
        while (JSBI.greaterThan(abs(JSBI.subtract(d, dPrev)), ONE)) {
            if (num++ > 100) {
                break;
            }
            let dP = d;
            for (let i = 0; i < mulTarget.length; i++) {
                dP = JSBI.divide(JSBI.multiply(dP, d), JSBI.multiply(this.numOfTokens, mulTarget[i]));
            }
            dPrev = d;
            d = JSBI.divide(JSBI.multiply(JSBI.add(JSBI.multiply(sum, ampXnum), JSBI.multiply(dP, this.numOfTokens)), d), JSBI.add(JSBI.multiply(JSBI.subtract(ampXnum, ONE), d), JSBI.multiply(JSBI.add(this.numOfTokens, ONE), dP)));
        }
        return d;
    };
    proto.computeY = function computeY(tokenAmounts, inputIndex, outputIndex, newTotalAmount) {
        let d = this.computeD(tokenAmounts);
        let target = this.mulTarget(tokenAmounts);
        target[inputIndex] = newTotalAmount;
        target.splice(outputIndex, 1);
        let ampXnum = JSBI.multiply(this.amp, this.numOfTokens);
        let c = d;
        for (let i = 0; i < target.length; i++) {
            c = JSBI.divide(JSBI.multiply(c, d), JSBI.multiply(target[i], this.numOfTokens));
        }
        c = JSBI.divide(JSBI.multiply(c, d), JSBI.multiply(this.numOfTokens, ampXnum));
        let b = JSBI.subtract(JSBI.add(arraySum(target), JSBI.divide(d, ampXnum)), d);
        let lastY = ZERO;
        let y = d;
        while (JSBI.greaterThan(abs(JSBI.subtract(y, lastY)), ONE)) {
            lastY = y;
            y = JSBI.divide(JSBI.add(JSBI.exponentiate(y, TWO), c), JSBI.add(JSBI.multiply(TWO, y), b));
        }
        return y;
    };
    return StableCurve;
}();
let Stable = function () {
    function Stable(numOfTokens, amp, targetPrices) {
        this.targetPrices = void 0;
        this.StableCurve = void 0;
        this.targetPrices = targetPrices;
        this.StableCurve = new StableCurve(numOfTokens, amp, this.targetPrices);
    }
    let proto = Stable.prototype;
    proto.getOutputAmount = function getOutputAmount(tokenAmounts, inputTradeAmount, inputIndex, outputIndex) {
        return this.StableCurve.swap(tokenAmounts, inputIndex, outputIndex, inputTradeAmount);
    };
    return Stable;
}();
exports.Stable = Stable;
