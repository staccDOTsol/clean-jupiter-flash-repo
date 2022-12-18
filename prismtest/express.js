const { SolendMarket } = require("@solendprotocol/solend-sdk")//./solend-sdk/save/classes");
const { getOrCreateAssociatedTokenAccount } = require("./spl-token/");
const { createTransferInstruction } = require("./spl-token/");
const {
	Connection,
	Keypair,
	PublicKey,
	sendAndConfirmTransaction,
	VersionedMessage,
	Transaction,

  } = require( "@solana/web3.js" );
const {
	flashRepayReserveLiquidityInstruction,
} = require("@solendprotocol/solend-sdk")//"./solend-sdk/save/instructions/flashRepayReserveLiquidity"); //./solend-sdk/save/instructions/flashRepayReserveLiquidity");
const {
	flashBorrowReserveLiquidityInstruction,
} = require("@solendprotocol/solend-sdk");
const { TransactionMessage, VersionedTransaction, ComputeBudgetProgram } = require("@solana/web3.js");
const fs = require("fs");
const bs58 = require("bs58");


const JSBI =require( "jsbi");
const {
  Jupiter, getPlatformFeeAccounts,
} = require( "@jup-ag/core" ) ;
const Decimal = require( "decimal.js");

async function getRoutes  ({
  jupiter,
  inputToken,
  outputToken,
  inputAmount,
  slippageBps, innn}
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
		  if (routes.routeInfos[0].outAmount > innn ){
			return null
		  }
	const routes2 =
		await jupiter.computeRoutes({
			  inputMint: new PublicKey(outputToken.address),
			  outputMint: new PublicKey(inputToken.address),
			  amount: routes.routesInfos[0].outAmount, // raw input amount of tokens
			  slippageBps,
			  forceFetch: true,
			})
		  ;	  
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
//var SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey(
//  "E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa"
//);
var { SOLEND_PRODUCTION_PROGRAM_ID } = require("@solendprotocol/solend-sdk");

let tgoaccs = {};
let jupiter, market, goluts;
let goaccs = [];
setTimeout(async function () {
	const platformFeeAndAccounts = {
		feeBps: 50,
		feeAccounts: await getPlatformFeeAccounts(
		  connection,
		  wallet.publicKey // The platform fee account owner
		),
	  };
  
	jupiter = await Jupiter.load({
		connection, routeCacheDuration: 0,
		cluster: 'mainnet-beta',
		platformFeeAndAccounts,
		user: wallet, shouldLoadSerumOpenOrders: true,
		restrictIntermediateTokens: false, usePreloadedAddressLookupTableCache: false
	  });

	market = await SolendMarket.initialize(
		connection,
		"production"
		,"7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
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
			  // If you want to add platformFee as integrator: https://docs.jup.ag/jupiter-core/adding-platform-fees
			  const platformFeeAndAccounts = {
				feeBps: 50,
				feeAccounts: await getPlatformFeeAccounts(
				  connection,
				  wallet.publicKey // The platform fee account owner
				),
			  };
		  
			jupiter = await Jupiter.load({
				connection, routeCacheDuration: 0,
				cluster: 'mainnet-beta',
				platformFeeAndAccounts,
				user: wallet, shouldLoadSerumOpenOrders: true,
				restrictIntermediateTokens: false, usePreloadedAddressLookupTableCache: false
			  });
		}
		if (!market) {
			market = await SolendMarket.initialize(
				connection,
				"production"
				,"7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
			);
		}
		else  if (market.reserves[i]){
		
		// @ts-ignore
		let symbol = market.reserves[i].config.liquidityToken.symbol;
		//mod = Math.random() * 0.05 + 0.001; 	
		 atokens[i] = {
			address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
			decimals: 6,//,market.reserves[i].config.liquidityToken.decimals,
			symbol: "USDC"//market.reserves[i].config.liquidityToken.symbol,
		};

		if (tokenb.address == atokens[i].address){
return
		}
		const pubkey = (
			await connection.getParsedTokenAccountsByOwner(
				new PublicKey("55YceCDfyvdcPPozDiMeNp9TpwmL1hdoTEFw5BMNWbpf"),//,HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV"), //"),
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
const someroutes = await getRoutes ({
	jupiter,
	inputToken: atokens[i],
	outputToken: tokenb,
	inputAmount: (amountToTrade) / 10 ** atokens[i].decimals,
	slippageBps: 2, innn})
	const routes = someroutes[0]
	const routes2 = someroutes[1]

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
											new Decimal 	(routes.routesInfos[0].inAmount.toString())
          .div(10 ** tokenb.decimals) * 1.0072 < new Decimal(routes2.routesInfos[0].outAmount.toString())
          .div(10 ** atokens[i].decimals) &&
											!doing
										) {
											//doing = true
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
												routeInfo:routes.routesInfos[0],
											  });
											  const execute2 = await jupiter.exchange({
												routeInfo:routes2.routesInfos[0],
												});
										  
											let thepaydirt = [];
											let c = 0;
											let DecompileArgs1 = {addressLookupTableAccounts: execute.addressLookupTableAccounts}
											let decompiled1 = TransactionMessage.decompile(
											execute.swapTransaction.message,
											DecompileArgs1)
											let DecompileArgs2 = {addressLookupTableAccounts: execute2.addressLookupTableAccounts}
											let decompiled2 = TransactionMessage.decompile(
											execute2.swapTransaction.message,
											DecompileArgs2)
											var cc3 = 0 
											let newix = []
											for (var ix of decompiled2.instructions){
												if (cc3 > 0){
													newix.push(ix)
												}
												cc3++
											}
											let mainTransaction = new Transaction().add(...decompiled1.instructions)
											let mp = new Transaction().add(...newix)
											let pt =  new Transaction()
											let preTransaction =  new Transaction()
											if (execute.setupTransaction){
												let DecompileArgs2 = {addressLookupTableAccounts: execute.addressLookupTableAccounts}
											let decompiled2 = TransactionMessage.decompile(
											execute.setupTransaction.message,
											DecompileArgs2)
											 preTransaction.add(...decompiled2.instructions)
											
											}
											if (execute2.setupTransaction){
												let DecompileArgs2 = {addressLookupTableAccounts: execute2.addressLookupTableAccounts}
											let decompiled2 = TransactionMessage.decompile(
											execute2.setupTransaction.message,
											DecompileArgs2)
											 pt.add(...decompiled2.instructions)
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
											//  const ix138 =
											//  ComputeBudgetProgram.setComputeUnitPrice (params);
										  
											let instructions = []//ix138];
											let ccc2 = 0 
											
											instructions.push(
												flashBorrowReserveLiquidityInstruction(
													Math.ceil(amountToTrade),
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
													Math.ceil(amountToTrade),
													0, //+pt.instructions.length,
													tokenAccount,
													new PublicKey(market.reserves[i].config.liquidityAddress),
													new PublicKey(
														market.reserves[i].config.liquidityFeeReceiverAddress//liquidityFeeReceiverAddress
													),
													tokenAccount,
													new PublicKey(market.reserves[i].config.address),
													new PublicKey(market.config.address),
													wallet.publicKey,
													SOLEND_PRODUCTION_PROGRAM_ID/*,
                new PublicKey(jaregms[atokens[i].symbol]),
                new PublicKey(market.reserves[i].config.liquidityToken.mint*///)
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
													transaction,
													{}
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
					//for (var i = 2; i<= 13; i++){
					//   if (i != 1){
					if (tokenbt != undefined) {
						if (tokenbt.symbol != "SOL" && tokenbt.symbol != "USDC"){
						  dothehorriblething(1, tokenbt, parseFloat(ch.rawTokenAmount.tokenAmount),ch.rawTokenAmount.decimals)
setTimeout(async function(){
/*don't dot his it fucks up token
						 dothehorriblething(
							1,
							tokenbt,
							parseFloat(ch.rawTokenAmount.tokenAmount),ch.rawTokenAmount.decimals
						); */
						 
					}, Math.random() * 200)
				//}
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


var connection 
var superconnection = new Connection("https://rpc.helius.xyz/?api-key=81972555-7e88-4f2c-9a43-9072b958f572")

require("dotenv").config();

app.listen("3000");
