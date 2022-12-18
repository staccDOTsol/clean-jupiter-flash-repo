import { BN, BorshAccountsCoder } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import { PoolPairData } from './type';
import { BalancerAmm } from './type';
export declare const balansolCoder: BorshAccountsCoder<string>;
export declare const calcOutGivenInSwap: (amountIn: number, balanceOut: BN, balanceIn: BN, weightOut: number, weightIn: number, swapFee: BN) => number;
export declare const calcNormalizedWeight: (weights: BN[], weightToken: BN) => number;
export declare const calcSpotPriceExactInSwap: (amount: number, poolPairData: PoolPairData) => number;
export declare const calcPriceImpactSwap: (bidAmount: number, poolPairData: PoolPairData) => number;
export declare const getBalansolParams: (poolPublicKey: PublicKey, taxMan: PublicKey, mints: PublicKey[]) => Promise<{
    treasurer: PublicKey;
    taxmanTokenAccounts: PublicKey[];
}>;
export declare const getBalansolMarkets: (connection: Connection) => Promise<{
    owner: string;
    pubkey: any;
    data: any;
    params: {
        treasurer: PublicKey;
        taxmanTokenAccounts: PublicKey[];
    };
}[]>;
export declare function getBalansolPoolData(poolAdress: PublicKey, connection: Connection): Promise<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
    name: "pool";
    type: {
        kind: "struct";
        fields: [{
            name: "authority";
            type: "publicKey";
        }, {
            name: "fee";
            type: "u64";
        }, {
            name: "taxFee";
            type: "u64";
        }, {
            name: "state";
            type: {
                defined: "PoolState";
            };
        }, {
            name: "mintLpt";
            type: "publicKey";
        }, {
            name: "taxMan";
            type: "publicKey";
        }, {
            name: "mints";
            type: {
                vec: "publicKey";
            };
        }, {
            name: "actions";
            type: {
                vec: {
                    defined: "MintActionState";
                };
            };
        }, {
            name: "treasuries";
            type: {
                vec: "publicKey";
            };
        }, {
            name: "reserves";
            type: {
                vec: "u64";
            };
        }, {
            name: "weights";
            type: {
                vec: "u64";
            };
        }];
    };
}, import("@project-serum/anchor").IdlTypes<BalancerAmm>>>;
export declare function getQuote(sourceMint: PublicKey, destinationMint: PublicKey, amount: number, poolData: any): {
    notEnoughLiquidity: boolean;
    inAmount: number;
    outAmount: JSBI;
    feeAmount: JSBI;
    feeMint: string;
    feePct: number;
    priceImpactPct: number;
};
