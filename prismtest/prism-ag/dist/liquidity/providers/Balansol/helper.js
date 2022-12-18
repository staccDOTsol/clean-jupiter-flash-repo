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
exports.getQuote = exports.getBalansolPoolData = exports.getBalansolMarkets = exports.getBalansolParams = exports.calcPriceImpactSwap = exports.calcSpotPriceExactInSwap = exports.calcNormalizedWeight = exports.calcOutGivenInSwap = exports.balansolCoder = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const jsbi_1 = __importDefault(require("jsbi"));
// Balansol AMM
const constant_1 = require("./constant");
exports.balansolCoder = new anchor_1.BorshAccountsCoder(constant_1.IDL);
const calcOutGivenInSwap = (amountIn, balanceOut, balanceIn, weightOut, weightIn, swapFee) => {
    const numBalanceOut = Number(balanceOut.toString());
    const numBalanceIn = Number(balanceIn.toString());
    const numSwapFee = Number(swapFee.toString()) / constant_1.PRECISION;
    const ratioBeforeAfterBalance = numBalanceIn / (numBalanceIn + amountIn);
    const ratioInOutWeight = weightIn / weightOut;
    return (numBalanceOut *
        (1 - ratioBeforeAfterBalance ** ratioInOutWeight) *
        (1 - numSwapFee));
};
exports.calcOutGivenInSwap = calcOutGivenInSwap;
const calcNormalizedWeight = (weights, weightToken) => {
    const numWeights = weights.map((value) => value.toNumber() / constant_1.PRECISION);
    const numWeightToken = weightToken.toNumber() / constant_1.PRECISION;
    const weightSum = numWeights.reduce((pre, curr) => pre + curr, 0);
    return numWeightToken / weightSum;
};
exports.calcNormalizedWeight = calcNormalizedWeight;
const calcSpotPriceExactInSwap = (amount, poolPairData) => {
    const { balanceIn, balanceOut, weightIn, weightOut, swapFee } = poolPairData;
    // TODO: Consider whether use decimal or not here
    const Bi = Number(balanceIn.toString());
    const Bo = Number(balanceOut.toString());
    const wi = weightIn;
    const wo = weightOut;
    const f = Number(swapFee.toString()) / constant_1.PRECISION;
    return -((Bi * wo) /
        (Bo * (-1 + f) * (Bi / (amount + Bi - amount * f)) ** ((wi + wo) / wo) * wi));
};
exports.calcSpotPriceExactInSwap = calcSpotPriceExactInSwap;
const calcPriceImpactSwap = (bidAmount, poolPairData) => {
    const currentSpotPrice = (0, exports.calcSpotPriceExactInSwap)(0, poolPairData);
    const spotPriceAfterSwap = (0, exports.calcSpotPriceExactInSwap)(bidAmount, poolPairData);
    if (spotPriceAfterSwap < currentSpotPrice)
        return 0;
    const impactPrice = 1 - currentSpotPrice / spotPriceAfterSwap;
    return impactPrice;
};
exports.calcPriceImpactSwap = calcPriceImpactSwap;
const getBalansolParams = (poolPublicKey, taxMan, mints) => __awaiter(void 0, void 0, void 0, function* () {
    const [treasurer] = yield web3_js_1.PublicKey.findProgramAddress([Buffer.from('treasurer'), poolPublicKey.toBuffer()], constant_1.BALANSOL_PROGRAM_ID);
    const taxmanTokenAccounts = yield Promise.all(mints.map((mint) => anchor_1.utils.token.associatedAddress({ mint, owner: taxMan })));
    return { treasurer, taxmanTokenAccounts };
});
exports.getBalansolParams = getBalansolParams;
const getBalansolMarkets = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const BALANSOL_PROGRAM = (0, constant_1.getBalansolProgram)(connection);
    const pools = yield BALANSOL_PROGRAM.account.pool.all();
    // Parser Account Data
    const markets = yield Promise.all(pools.map((pool) => __awaiter(void 0, void 0, void 0, function* () {
        // Build Data
        const poolData = pool.account;
        // Build Params
        const params = yield (0, exports.getBalansolParams)(pool.publicKey, poolData.taxMan, poolData.mints);
        return {
            owner: constant_1.BALANSOL_PROGRAM_ID.toBase58(),
            pubkey: pool.publicKey.toBase58(),
            data: poolData,
            params,
        };
    })));
    return markets;
});
exports.getBalansolMarkets = getBalansolMarkets;
function getBalansolPoolData(poolAdress, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        const BALANSOL_PROGRAM = (0, constant_1.getBalansolProgram)(connection);
        let poolData = yield BALANSOL_PROGRAM.account.pool.fetch(poolAdress);
        return poolData;
    });
}
exports.getBalansolPoolData = getBalansolPoolData;
function getQuote(sourceMint, destinationMint, amount, poolData) {
    // Validate mint state
    if (!poolData)
        throw new Error('Invalid Pool Data');
    if (!poolData.state['initialized'])
        throw new Error('Invalid Pool State');
    const mintList = poolData.mints.map((mint) => mint.toBase58());
    const bidMintIndex = mintList.indexOf(sourceMint.toBase58());
    const askMintIndex = mintList.indexOf(destinationMint.toBase58());
    // Validate Mint State
    // @ts-ignore
    if (!poolData.actions[bidMintIndex]['active'])
        throw new Error('Invalid bid mint state');
    // @ts-ignore
    if (!poolData.actions[askMintIndex]['active'])
        throw new Error('Invalid ask mint state');
    const weightIn = (0, exports.calcNormalizedWeight)(poolData.weights, poolData.weights[bidMintIndex]);
    const weightOut = (0, exports.calcNormalizedWeight)(poolData.weights, poolData.weights[askMintIndex]);
    // Route
    const amountOut = (0, exports.calcOutGivenInSwap)(Number(amount.toString()), poolData.reserves[askMintIndex], poolData.reserves[bidMintIndex], weightOut, weightIn, poolData.fee.add(poolData.taxFee));
    const priceImpact = (0, exports.calcPriceImpactSwap)(Number(amount.toString()), {
        balanceIn: poolData.reserves[bidMintIndex],
        balanceOut: poolData.reserves[askMintIndex],
        weightIn,
        weightOut,
        swapFee: poolData.fee.add(poolData.taxFee),
    });
    const totalFeeRatio = poolData.fee.add(poolData.taxFee);
    const feeRatio = totalFeeRatio.toNumber() / 10 ** 9;
    const feeAmount = (amountOut / (1 - feeRatio)) * feeRatio;
    return {
        notEnoughLiquidity: false,
        inAmount: amount,
        outAmount: jsbi_1.default.BigInt(Math.floor(amountOut)),
        feeAmount: jsbi_1.default.BigInt(Math.floor(feeAmount)),
        feeMint: destinationMint.toBase58(),
        feePct: 0,
        priceImpactPct: priceImpact,
    };
}
exports.getQuote = getQuote;
