"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCubicRoots = void 0;
const decimal_js_1 = require("decimal.js");
const NEGATIVE_ONE = new decimal_js_1.Decimal(-1);
const ZERO = new decimal_js_1.Decimal(0);
const ONE = new decimal_js_1.Decimal(1);
const TWO = new decimal_js_1.Decimal(2);
const THREE = new decimal_js_1.Decimal(3);
const EPS = TWO.pow(-52);
class Root {
    constructor(x, y) {
        this.real = x;
        this.imag = y;
    }
}
function sign(n) {
    if (n.gt(ZERO)) {
        return ONE;
    }
    else if (n.lt(ZERO)) {
        return NEGATIVE_ONE;
    }
    else {
        return ZERO;
    }
}
/**
 * Calculates the discriminant of Ax^2 + Bx + C = 0.
 */
function disc(A, B, C) {
    let a = A;
    let b = B;
    let c = C;
    const isIntCoeffs = decimal_js_1.Decimal.floor(A).sub(A).abs().eq(ZERO) &&
        decimal_js_1.Decimal.floor(b).sub(b).abs().eq(ZERO) &&
        decimal_js_1.Decimal.floor(C).sub(C).abs().eq(ZERO);
    if (isIntCoeffs) {
        if (a.mul(c).gt(ZERO)) {
            a = A.abs();
            c = C.abs();
        }
        let loopCondition = false;
        do {
            loopCondition = false;
            if (a < c) {
                const tmp = a;
                a = c;
                c = tmp;
            }
            const n = nearestInt(b.div(c));
            if (!n.eq(ZERO)) {
                const alpha = a.sub(n.mul(b));
                if (alpha.gte(a.neg())) {
                    b = b.sub(n.mul(c));
                    a = alpha.sub(n.mul(b));
                    if (a.gt(ZERO)) {
                        loopCondition = true;
                    }
                }
            }
        } while (loopCondition);
    }
    return b.mul(b).sub(a.mul(c));
}
/** Calculates the nearest integer to a number. */
function nearestInt(n) {
    const l = decimal_js_1.Decimal.floor(n);
    const h = decimal_js_1.Decimal.ceil(n);
    const dl = n.sub(l).abs();
    const dh = n.sub(h).abs();
    return dl.gt(dh) ? dh : dl;
}
/** Computes the roots of the quadratic Ax^2 + Bx + C = 0. */
function qdrtc(A, B, C) {
    const b = B.div(TWO).neg();
    const q = disc(A, b, C);
    let X1 = ZERO;
    let Y1 = ZERO;
    let X2 = ZERO;
    let Y2 = ZERO;
    if (q.lt(ZERO)) {
        const X = b.div(A);
        const Y = q.neg().sqrt().div(A);
        X1 = X;
        Y1 = Y;
        X2 = X;
        Y2 = Y.neg();
    }
    else {
        Y1 = ZERO;
        Y2 = ZERO;
        const r = b.add(sign(b).mul(q.sqrt()));
        if (r.eq(ZERO)) {
            X1 = C.div(A);
            X2 = C.div(A).neg();
        }
        else {
            X1 = C.div(r);
            X2 = r.div(A);
        }
    }
    return [new Root(X1, Y1), new Root(X2, Y2)];
}
function evaluate(x, A, B, C, D) {
    const q0 = A.mul(x);
    const B1 = q0.add(B);
    const C2 = B1.mul(x).add(C);
    return {
        Q: C2.mul(x).add(D),
        dQ: q0.add(B1).mul(x).add(C2),
        B1,
        C2,
    };
}
function getCubicRoots(A, B, C, D) {
    // method based on Kahan's notes "To Solve a Real Cubic Equation"
    let X;
    let a;
    let b1;
    let c2;
    const roots = [];
    if (A.eq(ZERO)) {
        a = B;
        b1 = C;
        c2 = D;
    }
    else if (D.eq(ZERO)) {
        X = ZERO;
        a = A;
        b1 = B;
        c2 = C;
        roots.push(new Root(X, ZERO));
    }
    else {
        a = A;
        X = B.div(A).div(THREE).neg();
        let evalInfo = evaluate(X, A, B, C, D);
        let q = evalInfo.Q;
        let dq = evalInfo.dQ;
        b1 = evalInfo.B1;
        c2 = evalInfo.C2;
        let t = q.div(A);
        let r = t.abs().cubeRoot();
        const s = sign(t);
        t = dq.div(A).neg();
        if (t.gt(ZERO)) {
            r = new decimal_js_1.Decimal("1.324717957244746").mul(decimal_js_1.Decimal.max(r, t.sqrt()));
        }
        let x0 = X.sub(s.mul(r));
        if (!x0.eq(X)) {
            const den = EPS.mul(100).add(ONE);
            do {
                X = x0;
                evalInfo = evaluate(X, A, B, C, D);
                q = evalInfo.Q;
                dq = evalInfo.dQ;
                b1 = evalInfo.B1;
                c2 = evalInfo.C2;
                x0 = dq.eq(ZERO) ? X : X.sub(q.div(dq).div(den));
            } while (s.mul(x0).gt(s.mul(X)));
            if (A.abs().mul(X).mul(X).gt(D.div(X).abs())) {
                c2 = D.div(X).neg();
                b1 = c2.sub(C).div(X);
            }
        }
        roots.push(new Root(X, ZERO));
    }
    const quadInfo = qdrtc(a, b1, c2);
    return roots.concat(quadInfo);
}
exports.getCubicRoots = getCubicRoots;
