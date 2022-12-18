"use strict";
// import { Amm } from '@jup-ag/core'
// import JSBI from 'jsbi'
// import { PublicKey, AccountInfo, TransactionInstruction } from '@solana/web3.js'
// import { BN, BorshAccountsCoder, utils, web3 } from '@project-serum/anchor'
// import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token'
// import {
//   AccountInfoMap,
//   Quote,
//   QuoteParams,
//   SwapParams,
// } from '../jupiterCore/type'
// import { mapAddressToAccountInfos } from '../jupiterCore/wrapJupiterCore'
// // Balansol AMM
// import {
//   calcNormalizedWeight,
//   calcOutGivenInSwap,
//   calcPriceImpactSwap,
// } from './helper'
// import { getBalansolProgram, IDL } from './constant'
// import { BalansolMarketParams, PoolData } from './type'
// const balansolCoder = new BorshAccountsCoder(IDL)
// export class BalansolAmm implements Amm {
//   label: string
//   id: string
//   reserveTokenMints: PublicKey[]
//   shouldPrefetch: boolean
//   exactOutputSupported: boolean
//   poolData: PoolData | undefined
//   constructor(
//     address: PublicKey,
//     accountInfo: AccountInfo<Buffer>,
//     public params: BalansolMarketParams,
//   ) {
//     const poolData: PoolData = balansolCoder.decode('pool', accountInfo.data)
//     this.poolData = poolData
//     this.label = 'Balansol'
//     this.id = address.toBase58()
//     this.reserveTokenMints = poolData.mints
//     this.shouldPrefetch = false
//     this.exactOutputSupported = false
//   }
//   getAccountsForUpdate(): PublicKey[] {
//     return [new web3.PublicKey(this.id)]
//   }
//   update(accountInfoMap: AccountInfoMap): void {
//     let [newPoolState] = mapAddressToAccountInfos(
//       accountInfoMap,
//       this.getAccountsForUpdate(),
//     )
//     const poolData: PoolData = balansolCoder.decode('pool', newPoolState.data)
//     this.poolData = poolData
//   }
//   getQuote({ sourceMint, destinationMint, amount }: QuoteParams): Quote {
//     // Validate mint state
//     if (!this.poolData) throw new Error('Invalid Pool Data')
//     if (!this.poolData.state['initialized'])
//       throw new Error('Invalid Pool State')
//     const mintList = this.poolData.mints.map((mint) => mint.toBase58())
//     const bidMintIndex = mintList.indexOf(sourceMint.toBase58())
//     const askMintIndex = mintList.indexOf(destinationMint.toBase58())
//     // Validate Mint State
//     // @ts-ignore
//     if (!this.poolData.actions[bidMintIndex]['active'])
//       throw new Error('Invalid bid mint state')
//     // @ts-ignore
//     if (!this.poolData.actions[askMintIndex]['active'])
//       throw new Error('Invalid ask mint state')
//     const weightIn = calcNormalizedWeight(
//       this.poolData.weights,
//       this.poolData.weights[bidMintIndex],
//     )
//     const weightOut = calcNormalizedWeight(
//       this.poolData.weights,
//       this.poolData.weights[askMintIndex],
//     )
//     // Route
//     const amountOut = calcOutGivenInSwap(
//       Number(amount.toString()),
//       this.poolData.reserves[askMintIndex],
//       this.poolData.reserves[bidMintIndex],
//       weightOut,
//       weightIn,
//       this.poolData.fee.add(this.poolData.taxFee),
//     )
//     const priceImpact = calcPriceImpactSwap(Number(amount.toString()), {
//       balanceIn: this.poolData.reserves[bidMintIndex],
//       balanceOut: this.poolData.reserves[askMintIndex],
//       weightIn,
//       weightOut,
//       swapFee: this.poolData.fee.add(this.poolData.taxFee),
//     })
//     const totalFeeRatio = this.poolData.fee.add(this.poolData.taxFee)
//     const feeRatio = totalFeeRatio.toNumber() / 10 ** 9
//     const feeAmount = (amountOut / (1 - feeRatio)) * feeRatio
//     return {
//       notEnoughLiquidity: false,
//       inAmount: amount,
//       outAmount: JSBI.BigInt(Math.floor(amountOut)),
//       feeAmount: JSBI.BigInt(Math.floor(feeAmount)),
//       feeMint: destinationMint.toBase58(),
//       feePct: 0,
//       priceImpactPct: priceImpact,
//     }
//   }
//   createSwapInstructions(swapParams: SwapParams): TransactionInstruction[] {
//     if (!this.poolData) throw new Error('Invalid Pool Data')
//     const bidAmount = swapParams.amount || new BN(0)
//     const limit = swapParams.otherAmountThreshold
//     const bidMintIdx = this.poolData.mints.findIndex((mint) =>
//       mint.equals(swapParams.sourceMint),
//     )
//     const askMintIdx = this.poolData.mints.findIndex((mint) =>
//       mint.equals(swapParams.destinationMint),
//     )
//     const ixSwap = BALANSOL_PROGRAM.instruction.swap(bidAmount, limit, {
//       accounts: {
//         authority: swapParams.userTransferAuthority,
//         pool: this.id,
//         taxMan: this.poolData.taxMan,
//         dstTokenAccountTaxman: this.params.taxmanTokenAccounts[askMintIdx],
//         // bid mint
//         bidMint: swapParams.sourceMint,
//         treasurer: this.params.treasurer,
//         srcTreasury: this.poolData.treasuries[bidMintIdx],
//         srcAssociatedTokenAccount: swapParams.userSourceTokenAccount,
//         // ask mint
//         askMint: swapParams.destinationMint,
//         dstTreasury: this.poolData.treasuries[askMintIdx],
//         dstAssociatedTokenAccount: swapParams.userDestinationTokenAccount,
//         //dstTreasurer: listMintInfo[1].treasurer,
//         rent: web3.SYSVAR_RENT_PUBKEY,
//         systemProgram: web3.SystemProgram.programId,
//         associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       },
//       remainingAccounts: swapParams.platformFee?.feeAccount
//         ? [
//             {
//               isSigner: false,
//               isWritable: true,
//               pubkey: swapParams.platformFee.feeAccount,
//             },
//           ]
//         : [],
//     })
//     return [ixSwap]
//   }
// }
