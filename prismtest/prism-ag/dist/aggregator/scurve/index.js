"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSingleTokenDepositOutput = exports.computeBaseOutputAmount = exports.computeEqualInput = exports.computeInputAmount = exports.computeOutputAmount = void 0;
const spl_token_1 = require("@solana/spl-token");
const decimal_js_1 = require("decimal.js");
const cuberoots_1 = require("./cuberoots");
const ZERO = new spl_token_1.u64(0);
const ONE = new spl_token_1.u64(1);
const TWO = new spl_token_1.u64(2);
const THREE = new spl_token_1.u64(3);
const FOUR = new spl_token_1.u64(4);
const EIGHT = new spl_token_1.u64(8);
const SIXTEEN = new spl_token_1.u64(16);
const N_COINS = TWO;
const N_COINS_SQUARED = new spl_token_1.u64(4);
// d = (leverage * sum_x + d_product * n_coins) * initial_d / ((leverage - 1) * initial_d + (n_coins + 1) * d_product)
function calculateStep(initialD, leverage, sumX, dProduct) {
    const leverageMul = leverage.mul(sumX);
    const dPMul = dProduct.mul(N_COINS);
    const leverageVal = leverageMul.add(dPMul).mul(initialD);
    const leverageSub = initialD.mul(leverage.sub(ONE));
    const nCoinsSum = dProduct.mul(N_COINS.add(ONE));
    const rVal = leverageSub.add(nCoinsSum);
    return leverageVal.div(rVal);
}
// A * sum(x_i) * n**n + D = A * D * n**n + D**(n+1) / (n**n * prod(x_i))
function computeD(leverage, amountA, amountB) {
    const amountATimesN = amountA.mul(N_COINS).add(ONE);
    const amountBTimesN = amountB.mul(N_COINS).add(ONE);
    const sumX = amountA.add(amountB);
    if (sumX.eq(ZERO)) {
        return ZERO;
    }
    let dPrevious;
    let d = sumX;
    for (let i = 0; i < 32; i++) {
        let dProduct = d;
        dProduct = dProduct.mul(d).div(amountATimesN);
        dProduct = dProduct.mul(d).div(amountBTimesN);
        dPrevious = d;
        d = calculateStep(d, leverage, sumX, dProduct);
        if (d.eq(dPrevious)) {
            break;
        }
    }
    return d;
}
/// Compute swap amount `y` in proportion to `x`
/// Solve for y:
/// y**2 + y * (sum' - (A*n**n - 1) * D / (A * n**n)) = D ** (n + 1) / (n ** (2 * n) * prod' * A)
/// y**2 + b*y = c
function _computeOutputAmount(leverage, newInputAmount, d) {
    const c = d
        .pow(N_COINS.add(ONE))
        .div(newInputAmount.mul(N_COINS_SQUARED).mul(leverage));
    const b = newInputAmount.add(d.div(leverage));
    let yPrevious;
    let y = d;
    for (let i = 0; i < 32; i++) {
        yPrevious = y;
        y = y.sqr().add(c).div(y.mul(TWO).add(b).sub(d));
        if (y.eq(yPrevious)) {
            break;
        }
    }
    return y;
}
// Javascript implementation of the solana program: https://github.com/solana-labs/solana-program-library/blob/f568413503d1b5bc6ca59b13f86e094d4d2516d6/token-swap/program/src/curve/stable.rs#L115
function computeOutputAmount(inputAmount, inputPoolAmount, outputPoolAmount, amp) {
    const leverage = amp.mul(N_COINS);
    const newInputPoolAmount = inputAmount.add(inputPoolAmount);
    const d = computeD(leverage, inputPoolAmount, outputPoolAmount);
    const newOutputPoolAmount = _computeOutputAmount(leverage, newInputPoolAmount, d);
    const outputAmount = outputPoolAmount.sub(newOutputPoolAmount);
    return new spl_token_1.u64(outputAmount.toString());
}
exports.computeOutputAmount = computeOutputAmount;
function computeInputAmount(outputAmount, inputPoolAmount, outputPoolAmount, amp) {
    const leverage = amp.mul(N_COINS);
    const newOutputPoolAmount = outputPoolAmount.sub(outputAmount);
    const d = computeD(leverage, outputPoolAmount, inputPoolAmount);
    const newInputPoolAmount = _computeOutputAmount(leverage, newOutputPoolAmount, d);
    const inputAmount = newInputPoolAmount.sub(inputPoolAmount);
    return new spl_token_1.u64(inputAmount.toString());
}
exports.computeInputAmount = computeInputAmount;
// Return the poolAmount if inputPoolAmount and outputPoolAmount were made equal. Used to calculate APY.
function computeEqualInput(tokenAPoolAmount, tokenBPoolAmount, amp) {
    const leverage = amp.mul(N_COINS);
    const invariant = computeD(leverage, tokenAPoolAmount, tokenBPoolAmount);
    const a = new decimal_js_1.Decimal(amp.mul(EIGHT).toString());
    const b = new decimal_js_1.Decimal(invariant.sub(amp.mul(invariant).mul(FOUR)).toString());
    const c = new decimal_js_1.Decimal(0);
    const d = new decimal_js_1.Decimal(invariant.neg().pow(THREE).div(FOUR).toString());
    const roots = (0, cuberoots_1.getCubicRoots)(a, b, c, d);
    return new spl_token_1.u64(roots[0].real.round().toString());
}
exports.computeEqualInput = computeEqualInput;
// Take the derivative of the invariant function over x
function computeBaseOutputAmount(inputAmount, inputPoolAmount, outputPoolAmount, amp) {
    const leverage = amp.mul(N_COINS);
    const invariant = computeD(leverage, inputPoolAmount, outputPoolAmount);
    const a = amp.mul(SIXTEEN);
    const b = a;
    const c = invariant.mul(FOUR).sub(invariant.mul(amp).mul(SIXTEEN));
    const numerator = TWO.mul(a)
        .mul(inputPoolAmount)
        .add(b.mul(outputPoolAmount))
        .add(c)
        .mul(outputPoolAmount);
    const denominator = a
        .mul(inputPoolAmount)
        .add(TWO.mul(b).mul(outputPoolAmount).add(c))
        .mul(inputPoolAmount);
    return new spl_token_1.u64(inputAmount.mul(numerator).div(denominator).toString());
}
exports.computeBaseOutputAmount = computeBaseOutputAmount;
function computeSingleTokenDepositOutput(inputAmount, isA, tokenAPoolAmount, tokenBPoolAmount, amp, poolTokenSupply) {
    if (inputAmount.eq(ZERO)) {
        return ZERO;
    }
    const leverage = amp.mul(N_COINS);
    const d0 = computeD(leverage, tokenAPoolAmount, tokenBPoolAmount);
    const [depositTokenAmount, otherTokenAmount] = isA ?
        [tokenAPoolAmount, tokenBPoolAmount] :
        [tokenBPoolAmount, tokenAPoolAmount];
    const updatedDepositTokenAmount = depositTokenAmount.add(inputAmount);
    const d1 = computeD(leverage, updatedDepositTokenAmount, otherTokenAmount);
    const diff = d1.sub(d0);
    const finalAmount = new decimal_js_1.Decimal(diff.toString()).mul(poolTokenSupply.toString()).div(d0.toString());
    return new spl_token_1.u64(finalAmount.floor().toString());
}
exports.computeSingleTokenDepositOutput = computeSingleTokenDepositOutput;
