import { web3, Program } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { BalancerAmm } from './type';
export declare const IDL: BalancerAmm;
export declare function getBalansolProgram(connection: Connection): Program<BalancerAmm>;
export declare const BALANSOL_PROGRAM_ID: web3.PublicKey;
export declare const PRECISION: number;
