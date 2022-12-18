/// <reference types="bn.js" />
import { BN } from '@project-serum/anchor';
import { IdlAccounts } from '@project-serum/anchor/dist/cjs/program/namespace/types';
import { PublicKey } from '@solana/web3.js';
export declare type BalansolMarketParams = {
    treasurer: PublicKey;
    taxmanTokenAccounts: PublicKey[];
};
export declare type PoolPairData = {
    balanceIn: BN;
    balanceOut: BN;
    weightIn: number;
    weightOut: number;
    swapFee: BN;
};
export declare type PoolData = IdlAccounts<BalancerAmm>['pool'];
export declare type BalancerAmm = {
    version: '0.1.0';
    name: 'balancer_amm';
    instructions: [
        {
            name: 'swap';
            accounts: [
                {
                    name: 'authority';
                    isMut: true;
                    isSigner: true;
                },
                {
                    name: 'pool';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'taxMan';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'bidMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'treasurer';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'srcTreasury';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'srcAssociatedTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'askMint';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'dstTreasury';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'dstAssociatedTokenAccount';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'dstTokenAccountTaxman';
                    isMut: true;
                    isSigner: false;
                },
                {
                    name: 'systemProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'tokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'associatedTokenProgram';
                    isMut: false;
                    isSigner: false;
                },
                {
                    name: 'rent';
                    isMut: false;
                    isSigner: false;
                }
            ];
            args: [
                {
                    name: 'bidAmount';
                    type: 'u64';
                },
                {
                    name: 'limit';
                    type: 'u64';
                }
            ];
            returns: 'u64';
        }
    ];
    accounts: [
        {
            name: 'pool';
            type: {
                kind: 'struct';
                fields: [
                    {
                        name: 'authority';
                        type: 'publicKey';
                    },
                    {
                        name: 'fee';
                        type: 'u64';
                    },
                    {
                        name: 'taxFee';
                        type: 'u64';
                    },
                    {
                        name: 'state';
                        type: {
                            defined: 'PoolState';
                        };
                    },
                    {
                        name: 'mintLpt';
                        type: 'publicKey';
                    },
                    {
                        name: 'taxMan';
                        type: 'publicKey';
                    },
                    {
                        name: 'mints';
                        type: {
                            vec: 'publicKey';
                        };
                    },
                    {
                        name: 'actions';
                        type: {
                            vec: {
                                defined: 'MintActionState';
                            };
                        };
                    },
                    {
                        name: 'treasuries';
                        type: {
                            vec: 'publicKey';
                        };
                    },
                    {
                        name: 'reserves';
                        type: {
                            vec: 'u64';
                        };
                    },
                    {
                        name: 'weights';
                        type: {
                            vec: 'u64';
                        };
                    }
                ];
            };
        }
    ];
    types: [
        {
            name: 'PoolState';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'Uninitialized';
                    },
                    {
                        name: 'Initialized';
                    },
                    {
                        name: 'Frozen';
                    },
                    {
                        name: 'Deleted';
                    }
                ];
            };
        },
        {
            name: 'MintActionState';
            type: {
                kind: 'enum';
                variants: [
                    {
                        name: 'Active';
                    },
                    {
                        name: 'BidOnly';
                    },
                    {
                        name: 'AskOnly';
                    },
                    {
                        name: 'Paused';
                    }
                ];
            };
        }
    ];
    errors: [];
};
