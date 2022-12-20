import { Prism } from "./prism-ag";
import { SolendMarket } from "./solend-sdk/save/classes";
import { getOrCreateAssociatedTokenAccount } from "./spl-token/";
import { createTransferInstruction } from "./spl-token/";
import { flashRepayReserveLiquidityInstruction } from "./solend-sdk/save/instructions/flashRepayReserveLiquidity";
import { flashBorrowReserveLiquidityInstruction } from "@solendprotocol/solend-sdk";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import fs from "fs";
import bs58 from "bs58";


const jaregms: any = {
  mSOL: "98ujMj4PcFBN6Rd4VRdELdwFMHEGtfGuN6uiTUs3QVPV",
  stSOL: "BgPgvbe11wMVGazRrX1jNgQnKzpRpPt1AVFHFenEtbAH",
  UST: "HtGvMME7965JxDfmUb2oQLWK3mfQxqRQGXXjigZDZoHH",
  MNGO: "GLnrq65xDUJWNWZwWvvPjzShTRMZq1gfAQawG7JuPbf3",
  PAI: "3PYf2cTZ2nYYy8JpJSPDyGAa4BS2esmwCzFA5nMod7Te",
  UXD: "6skAHGJNNDmtu1xE31gh2UaLS4YBuNT6cTjUFnBNMb7x",
  USDC: "HDuQnmkrezSY5FcPaERXA7pfnHSXDBYr5qMHd8CrwVRx",
  USDT: "BmsFXvuVUPooGhY8tkPGNrmwSEJ2P5SjifJm8XxbC86W",
  COPE: "FzsfC5sR4fw4osomUrFLUMjndzxnB6NV2V8FB7ScedMk",
  xUSD: "CmFKE3YUWGFH38Bg7M75zFFZU88XGRbiK4TNcTWUDVzs",
  DAI: "CVAFZGUTEjQTyGTceehsjjwUFVDKVMuWQZA22az8EvBg",
  USH: "7LbJDjdz5zChz4aTRj2TpBQTbg8rUKtcnYVodL3TeLw2",
  USDH: "rUxhyCLZD6tWqfdrD6HzDUceJSJdrddVGg834u2N9Lk",
};

const wallet = Keypair.fromSecretKey(
  // @ts-ignore
  bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);
console.log(wallet.publicKey.toBase58());
const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/Zf8WbWIes5Ivksj_dLGL_txHMoRA7-Kr",
  "singleGossip"
);
var SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey(
  "E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa"
);

async function findLuts(pairadd: any[]) {
  let goaccs: any = [];
let somejson = JSON.parse(fs.readFileSync('./luts.json').toString())
let keys = Object.keys(somejson)
for (var key of keys){
if (key.indexOf(pairadd[0]) != -1 || key.indexOf(pairadd[1]) != -1 ){
    try {
      // @ts-ignore
      for (var l of (somejson)[key]) {
        // @ts-ignore
        if (goaccs.length < 75) {
          try {
            let test = // @ts-ignore
              (await connection.getAddressLookupTable(new PublicKey(l))).value;
              // @ts-ignore
            if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
              // @ts-ignore
              goaccs.push(test)
            }
          } catch (err) {}
        }
      }
    } catch (err) {
      //console.log(err)
    }
  }
  }
  console.log("found " + goaccs.length.toString() + " luts...");
  return goaccs;
}

let tgoaccs: any = {}
let prism: any, market: any, goaccs: any, goluts
setTimeout(async function () {
   prism = await Prism.init({
    // user executing swap
    user: wallet, // optional (if you don't provide upon init, then you'll need to call prism.setSigner() after user connects the wallet)

    // rpc connection
    connection, // optional
    // slippage
    slippage: 100, // optional
  });

   market = await SolendMarket.initialize(connection, "production");
   for (var res of market.reserves){
    tokenbs.push({
      address: res.config.liquidityToken.mint,
      decimals: res.config.liquidityToken.decimals,
      symbol: res.config.asset,
    })
  }
   goaccs = [];
   goluts = [
    "BYCAUgBHwZaVXZsbH7ePZro9YVFKChLE8Q6z4bUvkF1f",
    "5taqdZKrVg4UM2wT6p2DGVY1uFnsV6fce3auQvcxMCya",
    "2V7kVs1TsZv7j38UTv4Dgbc6h258KS8eo5GZL9yhxCjv",
    "9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC",
    "2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi",
  ];
  for (var golut of goluts) {
    try {
      // @ts-ignore
      let test = (await connection.getAddressLookupTable(new PublicKey(golut)))
        .value;
      // @ts-ignore
      if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
        goaccs.push(test);
      }
    } catch (err) {
      console.log(err);
    }
  }
doTheThing()
})
let oldData: any = {}
let tokens = JSON.parse(fs.readFileSync("./tokens.json").toString());
let mod = 6.66;
let tokenbs: any = []
 async function dothehorriblething(i: number){
  //i = 10
  try {
      //    i = 10
    const reserve = market.reserves[i];
    // @ts-ignore
    let symbol = reserve.config.asset;
    console.log(symbol + " ... ... ... mod: " + mod.toString());
    const token = {
      address: reserve.config.liquidityToken.mint,
      decimals: reserve.config.liquidityToken.decimals,
      symbol: symbol,
    };

    const pubkey = (
      await connection.getParsedTokenAccountsByOwner(
        new PublicKey("HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV"),
        { mint: new PublicKey(token.address) }
      )
    ).value;
    let amount = 0;
    for (var pk of pubkey) {
      if (
        parseFloat(pk.account.data.parsed.info.tokenAmount.uiAmount) >
        amount
      ) {
        amount = parseInt(pk.account.data.parsed.info.tokenAmount.amount);
      }
    }

    await prism.loadRoutes("So11111111111111111111111111111111111111112", token.address, undefined); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
    let solamis = prism.getRoutes(0.000005); // get routes based on from Token amount 10 USDC -> ? PRISM
    const amountToTrade = Math.floor(amount * (mod / 100));
    let stuff = JSON.parse(fs.readFileSync('./luts.json').toString())
    let tokenb 
    let aran = Math.floor(Math.random() * (Object.keys(stuff).length))
    if (Object.keys(stuff)[aran].indexOf(token.address)){
    tokenb = tokens.find((t: any) => t.address === Object.keys(stuff)[aran].replace(token.address, ''));

    
    }
    if (!tokenb) { 

     tokenb = tokenbs[Math.floor(Math.random()* tokenbs.length)]
    }
    if (tokenb.address == token.address){
      return
    }
    tokenb = token
    
let maybe =     (await prism.loadRoutes(token.address, tokenb.address, oldData[token.address + tokenb.address]))

oldData[token.address + tokenb.address] = maybe.oldData; // load routes for tokens, tokenSymbol | tokenMint (base58 string)
    let routes = prism.getRoutes(amountToTrade / 10 ** token.decimals); // get routes based on from Token amount 10 USDC -> ? PRISM
    let tokenAccount = (
      await getOrCreateAssociatedTokenAccount(
        connection, // connection
        wallet, // fee payer
        new PublicKey(reserve.config.liquidityToken.mint),
        wallet.publicKey,
        true // mint
      )
    ).address;
    console.log(routes.length)
    for (var abc of [0, 1]) {
      if (routes[abc]) {
/*

      try {
   let maybe2=   (await prism.loadRoutes(tokenb.address, token.address, oldData[tokenb.address + token.address] )); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
try {
   oldData[tokenb.address + token.address] =    maybe2.oldData
   let routes2 = prism.getRoutes(routes[abc].amountOut / 1.001); // get routes based on from Token amount 10 USDC -> ? PRISM
console.log(routes2.length)
    for (var bca of [0,1,2]) {
      try {
        
        
        if (routes2[bca]) {
          console.log(routes2[bca].amountOut > routes[abc].amountIn) */
          if (routes[abc].amountOut > routes[abc].amountIn) {
            console.log(
              "trading " +
                (amountToTrade / 10 ** token.decimals).toString() +
                " " +
                token.symbol + ' solami fees to beat ' + solamis[0].amountOut.toString()
            );
try {
            let { preTransaction, mainTransaction } =
              await prism.generateSwapTransactions(routes[abc]); // execute swap (sign, send and confirm transaction)

//              let { preTransaction: pt, mainTransaction: mp } =
//              await prism.generateSwapTransactions(routes2[bca]); // execute swap (sign, send and confirm transaction)
              let thepaydirt: any[] = []

              for (var ix of [...mainTransaction.instructions]){//,
               // ...mp.instructions]){
                  if (!thepaydirt.includes(ix)){
                    thepaydirt.push(ix)
                  }
              }
let insts1: any = [
  ...preTransaction.instructions]
 // ...pt.instructions]
            let instructions: any = [
              flashBorrowReserveLiquidityInstruction(
                amountToTrade,
                new PublicKey(reserve.config.liquidityAddress),
                tokenAccount,
                new PublicKey(reserve.config.address),
                new PublicKey(market.config.address),
                SOLEND_PRODUCTION_PROGRAM_ID
              ),
              ...thepaydirt,
              flashRepayReserveLiquidityInstruction(
                amountToTrade,
                preTransaction.instructions.length,//+pt.instructions.length,
                tokenAccount,
                new PublicKey(reserve.config.liquidityAddress),
                new PublicKey(reserve.config.liquidityAddress),
                tokenAccount,
                new PublicKey(reserve.config.address),
                new PublicKey(market.config.address),
                wallet.publicKey,
                SOLEND_PRODUCTION_PROGRAM_ID,
                new PublicKey(jaregms[token.symbol]),
                new PublicKey(reserve.config.liquidityToken.mint)
              ),
              createTransferInstruction(
                tokenAccount, // from (should be a token account)
                new PublicKey(jaregms[token.symbol]),
                wallet.publicKey, // from's owner
                (
                  await connection.getParsedTokenAccountsByOwner(
                    wallet.publicKey,
                    {
                      mint: new PublicKey(
                        reserve.config.liquidityToken.mint
                      ),
                    }
                  )
                ).value[0].account.data.parsed.info.tokenAmount.amount + Math.ceil(solamis[0].amountOut * 0.8 * 10 ** token.decimals)
              )
            ];
            if (!Object.keys(tgoaccs).includes(token.symbol)){
              tgoaccs[token.symbol] = []
            }
          //  if (tgoaccs[token.symbol].length == 0){
              tgoaccs[token.symbol] = await findLuts([token.address, tokenb.address]);
          //  }
          if (insts1.length > 2){
          var messageV00 = new TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: await 
            (// @ts-ignore
              await connection.getLatestBlockhash()
            ).blockhash,
            instructions: insts1,
          }).compileToV0Message([...goaccs, ...tgoaccs[token.symbol]]);
          var transaction = new VersionedTransaction(messageV00);
          var result;
          try {
            transaction.sign([wallet]);

            result = await sendAndConfirmTransaction(
              connection,
              // @ts-ignore
              transaction,
              { skipPreflight: true },
              { skipPreflight: true }
            );
            console.log("tx1: https://solscan.io/tx/" + result);
            var txs = fs.readFileSync('./txs.txt').toString()
            txs+='\nhttps://solscan.io/tx/' + result 
            fs.writeFileSync('txs.txt', txs)
          } catch (err) {
            console.log(err);
          
          }
        }
            var messageV00 = new TransactionMessage({
              payerKey: wallet.publicKey,
              recentBlockhash: await 
              (// @ts-ignore
                await connection.getLatestBlockhash()
              ).blockhash,
              instructions,
            }).compileToV0Message([...goaccs, ...tgoaccs[token.symbol]]);
            var transaction = new VersionedTransaction(messageV00);
            var result = undefined;
            try {
              transaction.sign([wallet]);

              result = await sendAndConfirmTransaction(
                connection,
                // @ts-ignore
                transaction,
                { skipPreflight: true },
                { skipPreflight: true }
              );
              console.log("tx: https://solscan.io/tx/" + result);
              var txs = fs.readFileSync('./txs.txt').toString()
              txs+='\nhttps://solscan.io/tx/' + result 
              fs.writeFileSync('txs.txt', txs)
            } catch (err) {
              console.log(err);
              r
            }
            if (result != undefined) {
              mod = mod * 10;
            }
            
          } catch (err){
            console.log(err)
          }
        }
      }/*
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err){
    console.log(err)
  }
  } catch (err) {
    console.log(err);
  }
}*/
}
  } catch (err) {
    console.log(err);
  }
 }        
async function doTheThing(){
    //    let start = new Date().getTime() / 1000;

      if (mod < 0.0001) {
        mod = 100;
      }
      var a = 2;
      for (var i = 2; i<= 13; i++){
                if (i != 1){
        await  dothehorriblething(a)
         a++

      }
    }
    setTimeout(async function(){
     doTheThing()
   }, 1000)
      mod = mod / 2;
     
    }
