"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRECISION = exports.BALANSOL_PROGRAM_ID = exports.getBalansolProgram = exports.IDL = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
exports.IDL = {
    version: '0.1.0',
    name: 'balancer_amm',
    instructions: [
        {
            name: 'swap',
            accounts: [
                {
                    name: 'authority',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'pool',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'taxMan',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'bidMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'treasurer',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'srcTreasury',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'srcAssociatedTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'askMint',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'dstTreasury',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'dstAssociatedTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'dstTokenAccountTaxman',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'associatedTokenProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'bidAmount',
                    type: 'u64',
                },
                {
                    name: 'limit',
                    type: 'u64',
                },
            ],
            returns: 'u64',
        },
    ],
    accounts: [
        {
            name: 'pool',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'authority',
                        type: 'publicKey',
                    },
                    {
                        name: 'fee',
                        type: 'u64',
                    },
                    {
                        name: 'taxFee',
                        type: 'u64',
                    },
                    {
                        name: 'state',
                        type: {
                            defined: 'PoolState',
                        },
                    },
                    {
                        name: 'mintLpt',
                        type: 'publicKey',
                    },
                    {
                        name: 'taxMan',
                        type: 'publicKey',
                    },
                    {
                        name: 'mints',
                        type: {
                            vec: 'publicKey',
                        },
                    },
                    {
                        name: 'actions',
                        type: {
                            vec: {
                                defined: 'MintActionState',
                            },
                        },
                    },
                    {
                        name: 'treasuries',
                        type: {
                            vec: 'publicKey',
                        },
                    },
                    {
                        name: 'reserves',
                        type: {
                            vec: 'u64',
                        },
                    },
                    {
                        name: 'weights',
                        type: {
                            vec: 'u64',
                        },
                    },
                ],
            },
        },
    ],
    types: [
        {
            name: 'PoolState',
            type: {
                kind: 'enum',
                variants: [
                    {
                        name: 'Uninitialized',
                    },
                    {
                        name: 'Initialized',
                    },
                    {
                        name: 'Frozen',
                    },
                    {
                        name: 'Deleted',
                    },
                ],
            },
        },
        {
            name: 'MintActionState',
            type: {
                kind: 'enum',
                variants: [
                    {
                        name: 'Active',
                    },
                    {
                        name: 'BidOnly',
                    },
                    {
                        name: 'AskOnly',
                    },
                    {
                        name: 'Paused',
                    },
                ],
            },
        },
    ],
    errors: [],
};
function getBalansolProgram(connection) {
    const PROVIDER = new anchor_1.AnchorProvider(connection, new nodewallet_1.default(anchor_1.web3.Keypair.generate()), { skipPreflight: false });
    return new anchor_1.Program(exports.IDL, exports.BALANSOL_PROGRAM_ID, PROVIDER);
}
exports.getBalansolProgram = getBalansolProgram;
exports.BALANSOL_PROGRAM_ID = new web3_js_1.PublicKey('D3BBjqUdCYuP18fNvvMbPAZ8DpcRi4io2EsYHQawJDag');
exports.PRECISION = 10 ** 9;
