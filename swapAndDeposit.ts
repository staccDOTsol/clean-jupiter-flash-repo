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
 payer =Keypair.fromSecretKey(
    // @ts-ignore
	bs58.decode(process.env.goup)
); 
  setTimeout(async function(){
    let tas2 = await connection.getParsedTokenAccountsByOwner(payer.publicKey, {mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")})
console.log(tas2.value.length)
    for (var ta of tas2.value){
        try {
            if (false){//ta.pubkey.toBase58() != "8CtsE2gUUjc9KsfNEfFJSpxctZRPwoqWksy6m7UsjLSf"){
    let hm = await closeAccount(
        connection, // connection
        payer, // payer
      ta.pubkey, // token account which you want to close
        payer.publicKey, // destination
        payer // owner of token account
      );
    console.log(hm)
    }
    else {console.log('hehe')}       
} catch (err)

        {console.log(err)}
    }
   let prism =  await Prism.init({
			user: payer,
			connection: connection,
		
		})

    for (var reserve of configs[0].reserves){
      console.log(reserve.mint)
      let usdcbal = await connection.getTokenAccountBalance(new PublicKey("8CtsE2gUUjc9KsfNEfFJSpxctZRPwoqWksy6m7UsjLSf"))
      let juicy = Math.floor((parseInt(usdcbal.value.amount) / configs[0].reserves.length) / 100)

      // close user OpenOrders accounts and claim SOL paid for rent exemption 
   //   let txIds2 = await prism.closeOpenOrders(openOrdersToClose);
    //  console.log(txIds2)

    await prism.loadRoutes(
      "USDC",
      reserve.liquidityToken.mint
    )
        let routes = prism.getRoutes(juicy / 10 ** reserve.liquidityToken.decimals)
        console.log(routes[0].providers.length)
        //routes = routes.filter((r: any) => r.providers.length <= 1)
        console.log(routes.length)
			const swapTransaction = await prism.generateSwapTransactions(routes[0]); 
            let tx1 = new Transaction()

            await Promise.all(
                [swapTransaction.preTransaction/*,
              swapTransaction2.preTransaction, swapTransaction2.mainTransaction, swapTransaction2.postTransaction*/]
                  .filter(Boolean)
                  .map(async (serializedTransaction) => {
                
                try {    tx1.add(...serializedTransaction.instructions)
                } catch (err){

                } 
                }))
                  if (tx1.instructions.length>0){
                  tx1.recentBlockhash = await (
                    await connection.getLatestBlockhash()
                  ).blockhash;
                  tx1.sign(payer)
                  var hm2 = await sendAndConfirmTransaction(connection, tx1, [payer])
                  console.log(hm2) 
                  }
                  tx1 = new Transaction()
                  await Promise.all(
                    [swapTransaction.mainTransaction/*,
                  swapTransaction2.preTransaction, swapTransaction2.mainTransaction, swapTransaction2.postTransaction*/]
                      .filter(Boolean)
                      .map(async (serializedTransaction) => {
                        tx1.add(...serializedTransaction.instructions)
                      }))
    
                      tx1.recentBlockhash = await (
                        await connection.getLatestBlockhash()
                      ).blockhash;
                      tx1.sign(payer)
                     var  hm2 = await sendAndConfirmTransaction(connection, tx1, [payer])
                      console.log(hm2) 
    

                  }
                  for (var reserve of configs[0].reserves){
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
