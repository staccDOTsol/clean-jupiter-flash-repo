const { SolendMarket } = require("./solend-sdk/save/classes");
const { getOrCreateAssociatedTokenAccount } = require("./spl-token/");
const { createTransferInstruction } = require("./spl-token/");
const {
	Connection,
	Keypair,
	PublicKey,
	sendAndConfirmTransaction,

  } = require( "@solana/web3.js" );
const {
	flashRepayReserveLiquidityInstruction,
} = require("./solend-sdk/save/instructions/flashRepayReserveLiquidity"); //./solend-sdk/save/instructions/flashRepayReserveLiquidity");
const {
	flashBorrowReserveLiquidityInstruction,
} = require("@solendprotocol/solend-sdk");
const { TransactionMessage, VersionedTransaction, ComputeBudgetProgram } = require("@solana/web3.js");
const fs = require("fs");
const bs58 = require("bs58");


const JSBI =require( "jsbi");
const {
  Jupiter,
} = require( "@jup-ag/core" ) ;
const Decimal = require( "decimal.js");

async function getRoutes  (
  jupiter,
  inputToken,
  outputToken,
  inputAmount,
  slippageBps
) {
  try {
    if (!inputToken || !outputToken) {
      return null;
    }

    const inputAmountInSmallestUnits = Math.round(inputAmount * 10 ** inputToken.decimals)
      

    const routes =  await jupiter.computeRoutes({
            inputMint: new PublicKey(inputToken.address),
            outputMint: new PublicKey(outputToken.address),
            amount: JSBI.BigInt(inputAmountInSmallestUnits), // raw input amount of tokens
            slippageBps,
            forceFetch: true,
          })
	const routes2 =
		outputToken && inputToken
		  ? await jupiter.computeRoutes({
			  inputMint: new PublicKey(outputToken.address),
			  outputMint: new PublicKey(inputToken.address),
			  amount: routes.routesInfos[0].outAmount, // raw input amount of tokens
			  slippageBps,
			  forceFetch: true,
			})
		  : null;	  
    if (routes && routes.routesInfos && routes2 && routes2.routesInfos) {
      console.log("Possible number of routes:", routes.routesInfos.length, " ", routes2.routesInfos.length);
      console.log(
        "Best quotes: ",
        new Decimal(routes.routesInfos[0].outAmount.toString())
          .div(10 ** outputToken.decimals)
          .toString(),
        `(${outputToken.symbol})`
      );console.log(
        "Best quotes: ",
        new Decimal(routes2.routesInfos[0].outAmount.toString())
          .div(10 ** inputToken.decimals)
          .toString(),
        `(${inputToken.symbol})`
      );
      return [routes, routes2];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};



const api = "https://quote-api.jup.ag/v4/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000&slippageBps=50&onlyDirectRoutes=false&userPublicKey=EjXYEx6KH6gyKyQuUxj631Nu68Db9MzBL58ThsYtkgmJ&asLegacyTransaction=false"
function compare(arr1, arr2) {
	let count = 0;
	const max = arr1.length > arr2.length ? arr2.length : arr1.length;
	for (var i = 0; i < max; i++) {
		if (arr1[i].toBase58() == arr2[i].toBase58()) {
			count++;
		}
	}
	return count;
}

let ALT_RPC_LIST = process.env.ALT_RPC_LIST.split(",");
const jaregms = {
	USDC: "2wpYeJQmQAPaQFpB8jZPPbPuJPXgVLNPir2ohwGBCFD1",
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
var connection = new Connection(
	ALT_RPC_LIST[Math.floor(Math.random() * ALT_RPC_LIST.length)]
);
var SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey(
  "E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa"
);
//var { SOLEND_PRODUCTION_PROGRAM_ID } = require("@solendprotocol/solend-sdk");

let tgoaccs = {};
let jupiter, market, goluts;
let goaccs = [];
setTimeout(async function () {
	jupiter = await Jupiter.load({
		connection, routeCacheDuration: 0,
		cluster: ENV,
		platformFeeAndAccounts,
		user: USER_KEYPAIR, shouldLoadSerumOpenOrders: true,
		restrictIntermediateTokens: false, usePreloadedAddressLookupTableCache: false
	  });

	market = await SolendMarket.initialize(
		connection,
		"production"
		//"7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
	);
	for (var res of market.reserves) {
		tokenbs.push({
			address: res.config.liquidityToken.mint,
			decimals: res.config.liquidityToken.decimals,
			symbol: res.config.liquidityToken.symbol,
		});
		console.log(res.config.liquidityFeeReceiverAddress);
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
});
let oldData = {};
let tokens = JSON.parse(fs.readFileSync("./solana.tokenlist.json").toString());
let tokens2 = JSON.parse(fs.readFileSync("./tokens.json").toString());
let mod = 6.66;
let tokenbs = [];
var anobj = JSON.parse(fs.readFileSync("taps.json").toString());

var acoolobj = {}; //JSON.parse(fs.readFileSync('./acoolobj.json').toString())

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const {
	TOKEN_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	Token,
} = require("@solana/spl-token");

var app = express();
app.use(bodyParser());
app.use(cors());

var reservePairs = {};
// invalid cache. I will recommend using a paid RPC endpoint.
let atokens = {}
async function dothehorriblething(i, tokenbc, innn, dec) {
	mod = mod / 1.5
	const tokenb = tokenbc
	//i = 10
	try {
		if (!doing){
		//	doing = true
		//    i = 10
		if (!jupiter) {
			jupiter = await Jupiter.load({
				connection, routeCacheDuration: 0,
				cluster: ENV,
				platformFeeAndAccounts,
				user: USER_KEYPAIR, shouldLoadSerumOpenOrders: true,
				restrictIntermediateTokens: false, usePreloadedAddressLookupTableCache: false
			  });
		}
		if (!market) {
			market = await SolendMarket.initialize(
				connection,
				"production"
				//"7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
			);
		}
		else  if (market.reserves[i]){
		
		// @ts-ignore
		let symbol = market.reserves[i].config.liquidityToken.symbol;
		//mod = Math.random() * 0.05 + 0.001;
		 atokens[i] = {
			address: market.reserves[i].config.mint,
			decimals: market.reserves[i].config.liquidityToken.decimals,
			symbol: market.reserves[i].config.asset,
		};

		if (tokenb.address == atokens[i].address){
return
		}
		const pubkey = (
			await connection.getParsedTokenAccountsByOwner(
				new PublicKey("HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV"), //"),55YceCDfyvdcPPozDiMeNp9TpwmL1hdoTEFw5BMNWbpf
				{ mint: new PublicKey(atokens[i].address) }
			)
		).value
		let amount = 0;
		for (var pk of pubkey) {
				amount += parseInt(pk.account.data.parsed.info.tokenAmount.amount);
		}

		// await prism.loadRoutes("So11111111111111111111111111111111111111112", atokens[i].address, undefined); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
		//let solamis = prism.getRoutes(0.000005); // get routes based on from Token amount 10 USDC -> ? PRISM
		let amountToTrade = (amount * (mod));
		amountToTrade = parseInt(amountToTrade / 100)

console.log('amttotrade: ' + (amountToTrade / 10 ** atokens[i].decimals).toString())
const routes = await getRoutes ({
	jupiter,
	inputToken: atokens[i].address,
	outputToken: tokenb.address,
	amountToTrade: (amountToTrade) / 10 ** atokens[i].decimals,
	slippageBps: 2})
	let tokenAccount = (
			await getOrCreateAssociatedTokenAccount(
				connection, // connection
				wallet, // fee payer
				new PublicKey(market.reserves[i].config.liquidityToken.mint),
				wallet.publicKey
			)
		).address;
		console.log(routes.routesInfos.length);
		console.log(routes2.routesInfos.length);
		if (!routes.routesInfos[0] || !routes2.routesInfos[0]) return
			for (var abc of [0]){
				try {
					
							if (true) {
								var bca = 0//Math.floor(Math.random() * 2);
								try {
									for (var bca of [0]) {
										
										if (
											new Decimal(routes.routesInfos[0].inAmount.toString())
          .div(10 ** tokenb.decimals) > new Decimal(routes2.routesInfos[0].outAmount.toString())
          .div(10 ** atokens[i].decimals)* 1.002 &&
											!doing
										) {
											doing = true
											console.log(
												mod.toString() +
												atokens[i].symbol +
												" " +
												atokens[i].address + " mod " +
													
													tokenb.symbol +
													" " +
													tokenb.address
											);
											const execute = await jupiter.exchange({
												routeInfo,
											  });
											  const execute2 = await jupiter.exchange({
												  routeInfo: routeInfo2,
												});
										  
											let thepaydirt = [];
											let c = 0;
											let mainTransaction = execute.swapTransaction 
											let mp = execute2.swapTransaction
											let pt = []
											let preTransaction = []
											if (execute.setupTransaction){
												preTransaction = execute.setupTransaction 
											}
											if (execute2.setupTransaction){
												pt = execute.setupTransaction
											}
											for (var ix of [...mainTransaction.instructions]) {
												if (!thepaydirt.includes(ix)) {
													thepaydirt.push(ix);
												}
												c++;
											}
											let ccc = 0 
											for (var pi of pt.instructions){
												if (ccc > 0){
													thepaydirt.push(pi)
												}
												ccc++
											}
											c = 0;
											for (var ix of [...mp.instructions]) {
												if (!thepaydirt.includes(ix)) {
													thepaydirt.push(ix);
												}
												c++;
											}

											const associatedDestinationTokenAddr =
												await Token.getAssociatedTokenAddress(
													ASSOCIATED_TOKEN_PROGRAM_ID,
													TOKEN_PROGRAM_ID,
													new PublicKey(tokenb.address),
													wallet.publicKey
												);
											let instructions2 = [];
											const receiverAccount = await connection.getAccountInfo(
												associatedDestinationTokenAddr
											);

											if (
												receiverAccount !== null &&
												receiverAccount.owner.toBase58() !==
													wallet.publicKey.toBase58()
											) {
												// derived account of original owner was at one point transferred, so we transfer our account (only works with NFTs, not fungibles). I opened https://github.com/solana-labs/solana-program-library/issues/2514 to figure out fungibles
											} else {
												if (receiverAccount === null) {
													instructions2.push(
														Token.createAssociatedTokenAccountInstruction(
															ASSOCIATED_TOKEN_PROGRAM_ID,
															TOKEN_PROGRAM_ID,
															new PublicKey(tokenb.address),
															associatedDestinationTokenAddr,
															wallet.publicKey,
															wallet.publicKey
														)
													);
												}
											}

											const params = {
												microLamports: 0//1.38*10**5,
											  };
											  const ix138 =
											  ComputeBudgetProgram.setComputeUnitPrice (params);
										  
											let instructions = [ix138];
											let ccc2 = 0 
											
											instructions.push(
												flashBorrowReserveLiquidityInstruction(
													Math.ceil(routes[abc].amountIn * 10 ** atokens[i].decimals),
													new PublicKey(market.reserves[i].config.liquidityAddress),
													tokenAccount,
													new PublicKey(market.reserves[i].config.address),
													new PublicKey(market.config.address),
													SOLEND_PRODUCTION_PROGRAM_ID
												)
											);
											for (var ptix of preTransaction.instructions){
												if (ccc2 > 0){
													instructions.push(ptix)
												}
												ccc2++
											}
											if (instructions2.length > 0) {
												instructions.push(...instructions2);
											}

											instructions.push(...thepaydirt);
											instructions.push(
												flashRepayReserveLiquidityInstruction(
													Math.ceil(routes[abc].amountIn * 10 ** atokens[i].address),
													1, //+pt.instructions.length,
													tokenAccount,
													new PublicKey(market.reserves[i].config.liquidityAddress),
													new PublicKey(
														market.reserves[i].config.liquidityAddress//liquidityFeeReceiverAddress
													),
													tokenAccount,
													new PublicKey(market.reserves[i].config.address),
													new PublicKey(market.config.address),
													wallet.publicKey,
													SOLEND_PRODUCTION_PROGRAM_ID,
                new PublicKey(jaregms[atokens[i].symbol]),
                new PublicKey(market.reserves[i].config.liquidityToken.mint)
												)
											);
											instructions.push(
												createTransferInstruction(
													tokenAccount, // from (should be a token account)
													tokenAccount,
													wallet.publicKey, // from's owner
													(
														await connection.getParsedTokenAccountsByOwner(
															wallet.publicKey,
															{
																mint: new PublicKey(
																	market.reserves[i].config.liquidityToken.mint
																),
															}
														)
													).value[0].account.data.parsed.info.tokenAmount.amount //+ Math.ceil(solamis[0].amountMid * 0.8 * 10 ** atokens[i].address)
												)
											);
											console.log(instructions.length);
											if (!Object.keys(tgoaccs).includes(atokens[i].symbol)) {
												tgoaccs[atokens[i].symbol] = [];
											}
											//  if (tgoaccs[atokens[i].symbol].length == 0){
											tgoaccs[atokens[i].symbol] = [...execute.addressLookupTableAccounts, ...execute2.addressLookupTableAccounts]
											//  }
											var messageV00 = new TransactionMessage({
												payerKey: wallet.publicKey,
												recentBlockhash: await // @ts-ignore
												(
													await connection.getLatestBlockhash()
												).blockhash,
												instructions,
											}).compileToV0Message([
												...goaccs,
												...tgoaccs[atokens[i].symbol],
											]);
											var transaction = new VersionedTransaction(messageV00);
											var result = undefined;
											try {
												transaction.sign([wallet]);
												result = await sendAndConfirmTransaction(
													superconnection,
													// @ts-ignore
													transaction,
													{ skipPreflight: true, maxRetries: 10 },
													{ skipPreflight: true, maxRetries: 10 }
												);
												doing = false

												for (var i = 0; i<=100; i++){
												console.log("tx: https://solscan.io/tx/" + result);
												}
												var txs = fs.readFileSync("./txs.txt").toString();
												txs += "\nhttps://solscan.io/tx/" + result;
												fs.writeFileSync("txs.txt", txs);
											} catch (err) {
												console.log(err);

											}
											if (result != undefined) {
												mod = mod * 10;
											}
											doing = false;
										}
									}
								} catch (err) {
									doing = false;
									console.log(err);
								}
							}
						}
                        catch (err){
                            console.log(err)
                        }
					}
				}
			}
	
	} catch (err) {
		console.log(err);
	}
}
var doing = false;
app.post("/", async function (req, res) {
	if (req.body.fee > 5000) {
	}
	var looking = [];
	var rp = "";

	for (var abc of req.body[0].accountData) {
		if (abc.tokenBalanceChanges.length > 0) {
			for (var ch of abc.tokenBalanceChanges) {
				if (
					true
				) {
					if (mod < 0.0001) {
						mod = 100;
					}
					var a = 2;

					let tokenbt = tokens.find((t) => t.address === ch.mint);
					if (tokenbt == undefined) {
						tokenbt = tokens2.find((t) => t.address === ch.mint);
					}
					for (var i = 2; i<= 13; i++){
					//   if (i != 1){
					if (tokenbt != undefined) {
						if (tokenbt.symbol != "SOL" && tokenbt.symbol != "USDC"){
						  dothehorriblething(i, tokenbt, parseFloat(ch.rawTokenAmount.tokenAmount),ch.rawTokenAmount.decimals)
setTimeout(async function(){
/*don't dot his it fucks up token
						 dothehorriblething(
							1,
							tokenbt,
							parseFloat(ch.rawTokenAmount.tokenAmount),ch.rawTokenAmount.decimals
						); */
						 
					}, Math.random() * 200)
				}
					}
					a++;

					 }
					// }
				}
				if (anobj.includes(ch.tokenAccount)) {
					if (!Object.keys(acoolobj).includes(ch.tokenAccount)) {
						acoolobj[ch.tokenAccount] = parseFloat(
							(
								await connection.getTokenAccountBalance(
									new PublicKey(ch.tokenAccount)
								)
							).value.amount
						);
					} else {
						acoolobj[ch.tokenAccount] += parseFloat(
							ch.rawTokenAmount.tokenAmount
						);
					}
				}
			}
			if (req.body[0].feePayer == abc.tokenBalanceChanges[0].userAccount) {
				looking.push(
					-1 * parseFloat(abc.tokenBalanceChanges[0].rawTokenAmount.tokenAmount)
				);
				rp += abc.tokenBalanceChanges[0].mint + "-";
			}
		}
	}
	fs.writeFileSync("./acoolobj.json", JSON.stringify(acoolobj));

	for (var abc of req.body[0].accountData) {
		if (abc.tokenBalanceChanges.length > 0) {
			for (var cba of looking) {
				if (
					cba ==
					parseFloat(abc.tokenBalanceChanges[0].rawTokenAmount.tokenAmount)
				) {
					if (!Object.keys(reservePairs).includes(rp)) {
						reservePairs[rp] = [];
					}
					//console.log(abc.account);
					if (!reservePairs[rp].includes(abc.account)) {
						reservePairs[rp].push(abc.account);
					} else {
						// console.log(rp);
					}
				}
			}
		}
	}
	res.sendStatus(200);
});

const PromisePool = require("@supercharge/promise-pool").default;
let luts = [];


let theluts = JSON.parse(fs.readFileSync('./luts.json').toString());
var connection 
var superconnection = new Connection("https://rpc.helius.xyz/?api-key=81972555-7e88-4f2c-9a43-9072b958f572")
setTimeout(async function () {
  // invalid cache. I will recommend using a paid RPC endpoint.

  const configOrCommitment = {
    commitment: "confirmed",
    filters: [],
  };
  let myluts = {};

  luts = await connection.getProgramAccounts(
    AddressLookupTableProgram.programId
  );
  console.log(luts.length);
}); 
require("dotenv").config();

try {
  theluts = JSON.parse(fs.readFileSync("./tluts.json").toString());
} catch (err) {
  try {
    theluts = JSON.parse(fs.readFileSync("./luts.json").toString());
  } catch (err) {}
}
async function getLuts() {
  try {
    // invalid cache. I will recommend using a paid RPC endpoint.
    let ALT_RPC_LIST = process.env.ALT_RPC_LIST;
    // @ts-ignore
    await PromisePool.withConcurrency(250)
      .for(luts.reverse())
      // @ts-ignore
      .handleError(async (err, asset) => {
        console.error(`\nError uploading or whatever`, err.message);
        console.log(err);
      })
      // @ts-ignore
      .process(async (lut) => {
        // @ts-ignore

        // @ts-ignore
        let maybemine = await connection.getAddressLookupTable(lut.pubkey);

        if (maybemine.value.state.addresses.length > 66.6) {
          let templuts = [];
          if (true) {
            
            let gogo123 = true 
            // @ts-ignore	

            for (var addy of maybemine.value.state.addresses) {
              let addypk = addy.toBase58();
              let gogos = 0;
              for (var ammIdspks of Object.keys(reservePairs)) {
                for (var pk of reservePairs[ammIdspks]) {
                  try {
                    if (pk === addypk && !Object.keys(theluts).includes(ammIdspks)) {
                      //templuts.push(lut.pubkey.toBase58())
                      gogo123=true
                      //console.log(gogo123)

                    } else if (pk === addypk) {
                      //  templuts.push(lut.pubkey.toBase58())

                      if (!theluts[ammIdspks].includes(lut.pubkey.toBase58())) {
                        gogo123 = true
                      }
                    }

                    //   fs.writeFileSync('./tluts.json', JSON.stringify(theluts))
                  } catch (err) {}
                }
              }
            }
            for (var addy of maybemine.value.state.addresses) {
              let addypk = addy.toBase58();
              let gogos = 0;
              for (var ammIdspks of Object.keys(reservePairs)) {
                for (var pk of reservePairs[ammIdspks]) {
                  try {
                    if (pk === addypk && !Object.keys(theluts).includes(ammIdspks)) {
                      //templuts.push(lut.pubkey.toBase58())
                      theluts[ammIdspks] = [lut.pubkey.toBase58()];
                    console.log(Object.keys(theluts).length);
                    //  console.log(ammIdspks)
                      fs.writeFileSync("./luts.json", JSON.stringify(theluts));
                      gogos++;
                      
                    } else if (pk === addypk) {
                      //  templuts.push(lut.pubkey.toBase58())

                      if (!theluts[ammIdspks].includes(lut.pubkey.toBase58())) {
                        if(gogo123){
                      theluts[ammIdspks] = [lut.pubkey.toBase58()];
                        fs.writeFileSync("./luts.json", JSON.stringify(theluts));
                        gogos++;
                        }
                      }
                    }

                    //   fs.writeFileSync('./tluts.json', JSON.stringify(theluts))
                  } catch (err) {}
                }
              }
            }
          }
        }
      });
   
  } catch (err) {
    console.log(err);
  }
  setTimeout(() => {
    getLuts();
  }, 60000);
}

setTimeout(() => {
  getLuts();
}, 60000);
app.listen("3000");
