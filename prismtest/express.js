const { Prism } = require("@prism-hq/prism-ag");
const { SolendMarket } = require("@solendprotocol/solend-sdk");
const { getOrCreateAssociatedTokenAccount } = require("./spl-token/");
const { createTransferInstruction } = require("./spl-token/");
const {
	flashRepayReserveLiquidityInstruction,
} = require("@solendprotocol/solend-sdk"); //./solend-sdk/save/instructions/flashRepayReserveLiquidity");
const {
	flashBorrowReserveLiquidityInstruction,
} = require("@solendprotocol/solend-sdk");
const { TransactionMessage, VersionedTransaction, ComputeBudgetProgram } = require("@solana/web3.js");
const fs = require("fs");
const bs58 = require("bs58");
const {
	AddressLookupTableProgram,
	Connection,
	GetProgramAccountsConfig,
	Keypair,
	PublicKey,
	sendAndConfirmTransaction,
	Transaction,
} = require("@solana/web3.js");
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

async function findLuts(ixs, pairadd) {
	var arr1 = [];
	/*for (var ix of ixs) {
		try {
		for (var k of ix.keys) {
			arr1.push(k.pubkey);
		}
	} catch(err){

	}
	}*/
	connection = new Connection(
		ALT_RPC_LIST[Math.floor(Math.random() * ALT_RPC_LIST.length)]
	);
	let goaccs = [];
	let somejson = JSON.parse(fs.readFileSync("./luts.json").toString());
	let keys = Object.keys(somejson);
	let lastcompare = 0;
	let cs = [];

	for (var key of keys) {
		

	if (key.indexOf(pairadd[0]) != -1 || key.indexOf(pairadd[1]) != -1) {
		try {
			// @ts-ignore
			for (var l of somejson[key]) {
				// @ts-ignore
				if (goaccs.length < 50) {
					try {
						let test = // @ts-ignore
							(await connection.getAddressLookupTable(new PublicKey(l))).value;

						// @ts-ignore
						if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
							//let acompare = compare(arr1, test.state.addresses);
							//if (acompare >= 1){//} && acompare > lastcompare) {
							//	if (goaccs.length > 9) {
							//		lastcompare = acompare;
							//	} else {
							//		lastcompare = acompare - 2;
							//	}
								// @ts-ignore
								goaccs.push(test);
								console.log(goaccs.length);
							//}
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

let tgoaccs = {};
let prism, market, goluts;
let goaccs = [];
setTimeout(async function () {
	prism = await Prism.init({
		// user executing swap
		user: Keypair.fromSecretKey(
			// @ts-ignore
			bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
		), // optional (if you don't provide upon init, then you'll need to call prism.setSigner() after user connects the wallet)

		// rpc connection
		connection, // optional
		// slippage
		slippage: 100, // optional
	});

	market = await SolendMarket.initialize(
		connection,
		"production",
		"7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
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
async function dothehorriblething(i, tokenbc, innn, dec) {
	const tokenb = tokenbc
	//i = 10
	try {
		if (!doing){
		//	doing = true
		//    i = 10
		if (!prism) {
			prism = await Prism.init({
				// user executing swap
				user: Keypair.fromSecretKey(
					// @ts-ignore
					bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
				), // optional (if you don't provide upon init, then you'll need to call prism.setSigner() after user connects the wallet)

				// rpc connection
				connection, // optional
				// slippage
				slippage: 100, // optional
			});
		}
		if (!market) {
			market = await SolendMarket.initialize(
				connection,
				"production",
				"7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
			);
		}
		const reserve = market.reserves[i];
		// @ts-ignore
		let symbol = reserve.config.liquidityToken.symbol;
		mod = Math.random() * 15 + 1;
		const token = {
			address: reserve.config.liquidityToken.mint,
			decimals: reserve.config.liquidityToken.decimals,
			symbol: symbol,
		};

		if (tokenb.address == token.address){
return
		}
		const pubkey = (
			await connection.getParsedTokenAccountsByOwner(
				new PublicKey("55YceCDfyvdcPPozDiMeNp9TpwmL1hdoTEFw5BMNWbpf"), //HECVhRpddhzhkn6n1vdiqhQe1Y65yjXuwb45jKspD1VV"),
				{ mint: new PublicKey(token.address) }
			)
		).value
		let amount = 0;
		for (var pk of pubkey) {
				amount += parseInt(pk.account.data.parsed.info.tokenAmount.amount);
		}

		// await prism.loadRoutes("So11111111111111111111111111111111111111112", token.address, undefined); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
		//let solamis = prism.getRoutes(0.000005); // get routes based on from Token amount 10 USDC -> ? PRISM
		let amountToTrade = (amount * (mod));
		amountToTrade = parseInt(amountToTrade / 100)

console.log('amttotrade: ' + (amountToTrade / 10 ** token.decimals).toString())
		let maybe = await prism.loadRoutes(token.address, tokenb.address); //, oldData[token.address + tokenb.address]))

		//oldData[token.address + tokenb.address] = maybe.oldData; // load routes for tokens, tokenSymbol | tokenMint (base58 string)
		let routes = prism.getRoutes(amountToTrade / 10 ** token.decimals); // get routes based on from Token amount 10 USDC -> ? PRISM
		let tokenAccount = (
			await getOrCreateAssociatedTokenAccount(
				connection, // connection
				wallet, // fee payer
				new PublicKey(reserve.config.liquidityToken.mint),
				wallet.publicKey
			)
		).address;
		console.log(routes.length);
		if (!routes[0]) return
		if (innn < routes[0].amountOut * 10 ** dec) {
			var abc = Math.floor(Math.random() * 3);
			if (routes[abc]) {
				try {
					let maybe2 = await prism.loadRoutes(tokenb.address, token.address); //, oldData[tokenb.address + token.address] )); // load routes for tokens, tokenSymbol | tokenMint (base58 string)
					try {
						//  oldData[tokenb.address + token.address] =    maybe2.oldData
						if (true) {
							
							let routes2 = prism.getRoutes((routes[abc].amountOut/ 1.025) ); // get routes based on from Token amount 10 USDC -> ? PRISM
							console.log(routes2.length);
							if (true) {
								var bca = Math.floor(Math.random() * 2);
								try {
									if (routes2[bca]) {
										console.log(
											routes2[bca].amountOut > routes[abc].amountIn * 1.043
										);
										if (
											routes2[bca].amountOut > routes[abc].amountIn * 1.043 &&
											!doing
										) {
										//	doing = true
											console.log(
												mod.toString() +
												token.symbol +
												" " +
												token.address + " mod " +
													(routes[abc].amountIn ).toString() +
													"$ " +
													(routes[abc].amountOut).toString() +
													" outamnt " +
													tokenb.symbol +
													" " +
													tokenb.address
											);
											console.log(wallet.publicKey.toBase58());

											let { preTransaction, mainTransaction } =
												await prism.generateSwapTransactions(routes[abc]); // execute swap (sign, send and confirm transaction)

											let { preTransaction: pt, mainTransaction: mp } =
												await prism.generateSwapTransactions(routes2[bca]); // execute swap (sign, send and confirm transaction)
											let thepaydirt = [];
											let c = 0;

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
												microLamports: 1.38*10**8,
											  };
											  const ix138 =
											  ComputeBudgetProgram.setComputeUnitPrice (params);
										  
											let instructions = [ix138];
											let ccc2 = 0 
											
											instructions.push(
												flashBorrowReserveLiquidityInstruction(
													Math.ceil(routes[abc].amountIn * 10 ** token.decimals),
													new PublicKey(reserve.config.liquidityAddress),
													tokenAccount,
													new PublicKey(reserve.config.address),
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
													Math.ceil(routes[abc].amountIn * 10 ** token.decimals),
													1, //+pt.instructions.length,
													tokenAccount,
													new PublicKey(reserve.config.liquidityAddress),
													new PublicKey(
														reserve.config.liquidityFeeReceiverAddress
													),
													tokenAccount,
													new PublicKey(reserve.config.address),
													new PublicKey(market.config.address),
													wallet.publicKey,
													SOLEND_PRODUCTION_PROGRAM_ID /*,
                new PublicKey(jaregms[token.symbol]),
                new PublicKey(reserve.config.liquidityToken.mint)*/
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
																	reserve.config.liquidityToken.mint
																),
															}
														)
													).value[0].account.data.parsed.info.tokenAmount.amount //+ Math.ceil(solamis[0].amountOut * 0.8 * 10 ** token.decimals)
												)
											);
											console.log(instructions.length);
											if (!Object.keys(tgoaccs).includes(token.symbol)) {
												tgoaccs[token.symbol] = [];
											}
											//  if (tgoaccs[token.symbol].length == 0){
											tgoaccs[token.symbol] = await findLuts(instructions, [
												token.address,
												tokenb.address,
											]);
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
												...tgoaccs[token.symbol],
											]);
											var transaction = new VersionedTransaction(messageV00);
											var result = undefined;
											try {
												transaction.sign([wallet]);
												result = await sendAndConfirmTransaction(
													superconnection,
													// @ts-ignore
													transaction,
													{ skipPreflight: false, maxRetries: 10 },
													{ skipPreflight: false, maxRetries: 10 }
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
/*
		await prism.loadRoutes(token.address, tokenb.address); //, oldData[token.address + tokenb.address]))

		//oldData[token.address + tokenb.address] = maybe.oldData; // load routes for tokens, tokenSymbol | tokenMint (base58 string)
		let routes = prism.getRoutes(100/ 10 ** token.decimals); // get routes based on from Token amount 10 USDC -> ? PRISM
	
		let { preTransaction, mainTransaction } =
		await prism.generateSwapTransactions(routes[0]); // execute swap (sign, send and confirm transaction)

let insts = [...preTransaction.instructions, ...mainTransaction.instructions]
var tx = new Transaction().add(...insts)
tx.feePayer = wallet.publicKey
tx.blockhash = (await connection.getLatestBlockhash()).blockhash
var result = await connection.sendTransaction(tx, [wallet]
	)
	console.log('tx1: ' + result)
		 await prism.loadRoutes(tokenb.address, token.address); //, oldData[token.address + tokenb.address]))

		//oldData[token.address + tokenb.address] = maybe.oldData; // load routes for tokens, tokenSymbol | tokenMint (base58 string)
		let routes2 = prism.getRoutes(routes[0].amountOut / 2); // get routes based on from Token amount 10 USDC -> ? PRISM

	let { preTransaction: pt, mainTransaction: mp } =
		await prism.generateSwapTransactions(routes2[0]); 

let insts2 = [...pt.instructions, ...mp.instructions]
var tx = new Transaction().add(...insts2)
tx.feePayer = wallet.publicKey
tx.blockhash = (await connection.getLatestBlockhash()).blockhash
var result = await connection.sendTransaction(tx, [wallet]
	)
	console.log('tx2: ' + result)
	*/
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
					} catch (err) {
						console.log(err);
					}
				} catch (err) {
					console.log(err);
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
setTimeout(async function(){
						  dothehorriblething(0, tokenbt, parseFloat(ch.rawTokenAmount.tokenAmount),ch.rawTokenAmount.decimals)
}, Math.random() * 200)
setTimeout(async function(){

						 dothehorriblething(
							1,
							tokenbt,
							parseFloat(ch.rawTokenAmount.tokenAmount),ch.rawTokenAmount.decimals
						);
						 
					}, Math.random() * 200)
				}
					}
					a++;

					//  }
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
