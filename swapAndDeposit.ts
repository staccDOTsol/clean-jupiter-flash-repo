import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { depositReserveLiquidityInstruction ,redeemReserveCollateralInstruction,refreshReserveInstruction} from "./solend-sdk/dist";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
let connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/Zf8WbWIes5Ivksj_dLGL_txHMoRA7-Kr")
import fs from 'fs'
import { closeAccount } from "./src/spl-token/";

const { Prism } = require("@prism-hq/prism-ag");
const configs = JSON.parse(fs.readFileSync('./configs2.json').toString())

let payer : Keypair 
try { payer =Keypair.fromSecretKey(
    // @ts-ignore
	bs58.decode(process.env.goup)
); 
} catch (err){
  payer = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync('/Users/jarettdunn/notjaregm.json').toString()))
   );
}
  setTimeout(async function(){
   let prism =  await Prism.init({
			user: payer,
			connection: connection,
			slippage:10,
		
		})
    for (var reserve of configs[0].reserves.reverse()){
      console.log(reserve.mint)
      let usdcbal = await connection.getTokenAccountBalance(new PublicKey("8CtsE2gUUjc9KsfNEfFJSpxctZRPwoqWksy6m7UsjLSf"))
      let juicy = Math.floor((parseInt(usdcbal.value.amount) / configs[0].reserves.length) / 100)
     let ua=  prism.getUserAccounts();
for(var a of ua ){
 if (a.mint == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' && a.balance == 0)    {
    console.log(a)
    closeAccount(
        connection, // connection
        payer, // payer
       new PublicKey( a.address ), // token account which you want to close
        payer.publicKey, // destination
        payer.publicKey // owner of token account
      );
    
 }
}
      // unwrap all wSOL accounts for user
      let txIds = await prism.unwrapWSolAccounts();
      console.log(txIds)
      // get user Serum OpenOrders accounts
      let openOrders: Array<any> = prism.getUserOpenOrders();
      
      console.log(openOrders)
      // close user OpenOrders accounts and claim SOL paid for rent exemption 
   //   let txIds2 = await prism.closeOpenOrders(openOrdersToClose);
    //  console.log(txIds2)

    await prism.loadRoutes(
      "USDC",
      reserve.liquidityToken.mint
    )
        const routes = prism.getRoutes(juicy / 10 ** reserve.liquidityToken.decimals)
			const swapTransaction = await prism.swap(routes[0]); 
      let swapStatus = await prism.confirmSwap(swapTransaction); // Check Swap Status
console.log(swapStatus)
let tokenAccounts = await connection.getParsedTokenAccountsByOwner(payer.publicKey, {mint: new PublicKey(reserve.liquidityToken.mint)})

for (var ta of tokenAccounts.value){
if (ta.account.data.parsed.info.tokenAmount.amount > 0){
  const userCollateralAccountAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(reserve.collateralMintAddress),
    payer.publicKey
  );
  const userCollateralAccountInfo = await connection.getAccountInfo(
    userCollateralAccountAddress
  );
  let transaction = new Transaction()
  if (!userCollateralAccountInfo) {
    const createUserCollateralAccountIx =
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(reserve.collateralMintAddress),
        userCollateralAccountAddress,
        payer.publicKey,
        payer.publicKey
      );
  
  transaction.add(createUserCollateralAccountIx)
      }
      console.log('depositing: ' + ta.account.data.parsed.info.tokenAmount.uiAmount.toString() + ' ' + reserve.asset)
  transaction.add(
    depositReserveLiquidityInstruction(
      ta.account.data.parsed.info.tokenAmount.amount,
      ta.pubkey,
      userCollateralAccountAddress,
      new PublicKey(reserve.address),
      new PublicKey(reserve.liquidityAddress),
  
      new PublicKey(reserve.collateralMintAddress),
      new PublicKey(configs[0].address),   new PublicKey(configs[0].authorityAddress),
  
      payer.publicKey, // obligationOwner
      new PublicKey(
        "E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa"
      )    ))
  
  transaction.recentBlockhash = await (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.sign(payer)
  let hm2 = await sendAndConfirmTransaction(connection, transaction, [payer])
  console.log(hm2) 
}  

}
  
    }
    
})
