const { calculateProfit, toDecimal, storeItInTempAsJSON } = require("../utils");
const cache = require("./cache");
const fs = require("fs");
const JSBI = require("jsbi");
const { getSwapResultFromSolscanParser } = require("../services/solscan");
let {
	flashRepayReserveLiquidityInstruction,
	flashBorrowReserveLiquidityInstruction,
	SOLEND_PRODUCTION_PROGRAM_ID,
} = require("@solendprotocol/solend-sdk");
const {
	createTransferCheckedInstruction,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
	createAssociatedTokenAccount,
	closeAccount,
} = require("../spl-token");
const BN = require("bn.js");

var { SolendMarket } = require("@solendprotocol/solend-sdk");
if (process.env.tradingStrategy == "arbitrage") {
	var { SolendMarket } = require("../../solend-sdk/save/classes/market");
}

const {
	Keypair,
	Connection,
	PublicKey,
	TransactionMessage,
	VersionedTransaction,
	sendAndConfirmTransaction,
} = require("@solana/web3.js");
const bs58 = require("bs58");

let payer;
try {
	payer = Keypair.fromSecretKey(
		new Uint8Array(JSON.parse(fs.readFileSync("./int.json").toString()))
	);
} catch {
	payer = Keypair.fromSecretKey(
		bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
	);
}
Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY));
let {
	flashRepayReserveLiquidityInstruction: fr2,
} = require("../../solend-sdk/save/instructions/flashRepayReserveLiquidity");
const { Token, createTransferInstruction } = require("../spl-token");

const {
	ComputeBudgetProgram,
	Transaction,
} = require("@solana/web3.js/lib/index.cjs");

const swap = async (
	jupiter,
	route,
	route2,
	tokenA,
	market,
	reserve,
	amountToTrade
) => {
	if (process.env.tradingStrategy == "arbitrage") {
		SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey(
			"E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa"
		);
	}

	try {
		let tinsts = [];
		const performanceOfTxStart = performance.now();

		cache.performanceOfTxStart = performanceOfTxStart;
		let configs = JSON.parse(fs.readFileSync("./configs.json").toString());
		if (process.env.tradingStrategy == "arbitrage") {
			configs = JSON.parse(fs.readFileSync("./configs2.json").toString());
		}

		const swapTransaction = await jupiter.generateSwapTransactions(route);

		//const swapTransaction2 = await jupiter.generateSwapTransactions(route2);
		let tx1 = new Transaction();

		await Promise.all(
			[swapTransaction.preTransaction] //, swapTransaction2.preTransaction]/*, swapTransaction.mainTransaction, swapTransaction.postTransaction,
				//	  swapTransaction2.preTransaction/*, swapTransaction2.mainTransaction, swapTransaction2.postTransaction]*/
				.filter(Boolean)
				.map(async (serializedTransaction) => {
					try {
						tx1.push(...serializedTransaction.instructions);
					} catch (err) {}
				})
		);
		if (tx1.instructions.length > 0) {
			tx1.recentBlockhash = await (
				await connection.getLatestBlockhash()
			).blockhash;
			tx1.sign(payer);
			var hm2 = await sendAndConfirmTransaction(connection, tx1, [payer], {skipPreflight:true});
			console.log(hm2);
		}
		if (true) {
			////if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);

			/*
		const execute2 = await jupiter.exchange({
			routeInfo: route2,
		}); */
			let connection = new Connection(
				process.env.ALT_RPC_LIST.split(",")[
					Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
				],
				{ commitment: "singleGossip" }
			);
			let goluts = [
				"BYCAUgBHwZaVXZsbH7ePZro9YVFKChLE8Q6z4bUvkF1f",
				"5taqdZKrVg4UM2wT6p2DGVY1uFnsV6fce3auQvcxMCya",
				"2V7kVs1TsZv7j38UTv4Dgbc6h258KS8eo5GZL9yhxCjv",
				"9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC",
				"2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi",
			];
			let luts = {};
			try {
				luts = JSON.parse(fs.readFileSync("./tluts.json").toString());
			} catch (err) {
				try {
				} catch (err) {
					luts = JSON.parse(fs.readFileSync("./luts.json").toString());
				}
			}
			//			console.log(Object.keys(luts).length)
			let ammIds = [];
			let ammIdspks = [];

			for (var file of [route]) {
				//},...routes2]){//{//}),...routes2]){
				try {
					for (var rd of Object.values(file.routeData)) {
						try {
							for (var rd3 of Object.keys(rd)) {
								if (rd3.indexOf("amm") != -1) {
									try {
										if (rd2[rd].length > 20) {
											let test = new PublicKey(rd2[rd]).toBase58();
											if (!ammIds.includes(test)) ammIds.push(test);
										}
									} catch (err) {}
								}
							}
							// @ts-ignore
							for (var rd2 of Object.values(rd.routeData)) {
								try {
									for (var rd3 of Object.keys(rd2)) {
										if (rd3.indexOf("amm") != -1) {
											try {
												if (rd2[rd3].length > 20) {
													let test = (rd2[rd3]);
													if (!ammIds.includes(test)) ammIds.push(test);
												}
											} catch (err) {}
										}
									}
								} catch (err) {}
							}
						} catch (err) {}
					}
				} catch (Err) {}
			}
			console.log(ammIds);
			for (var mi of ammIds) {
				//}, ...route2.marketInfos]) {
				try {
					let maybeluts = luts[mi];
					if (maybeluts.length < 4) {
						if (goluts.length < 25) {
							goluts.push(...maybeluts);
						} else {
							break;
						}
						console.log("maybeluts: " + luts[mi].length.toString());
					}
				} catch (err) {
					//console.log(err);
				}
			}
			let goaccs = [];
			for (var golut of goluts) {
				connection = new Connection(
					process.env.ALT_RPC_LIST.split(",")[
						Math.floor(
							Math.random() * process.env.ALT_RPC_LIST.split(",").length
						)
					]
				);
				goaccs.push(
					(await connection.getAddressLookupTable(new PublicKey(golut))).value
				);
			}

			//	console.log(goaccs.length);

			let jaregm;
			let signers = [];
			let units = 266642;
			const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
				//234907
				units: units,
			});

			const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
				microLamports: Math.floor((units / 1000000) * 50),
			});

			tinsts.push(modifyComputeUnits);
			tinsts.push(addPriorityFee);

			let ata = (
				await connection.getParsedTokenAccountsByOwner(payer.publicKey, {
					mint: new PublicKey(reserve.config.liquidityToken.mint),
				})
			).value[0];
			let tokenAccount;
			try {
				tokenAccount = ata.pubkey;
			} catch (err) {
				console.log(err);
				/*	let ata = await createAssociatedTokenAccount(
					connection, // connection
					payer, // fee payer
					new PublicKey(reserve.config.liquidityToken.mint)
					,							payer.publicKey // mint
					);
				  
				  tokenAccount = ata */
			}

			try {
				jaregm = (
					await connection.getTokenAccountsByOwner(
						new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"),
						{ mint: new PublicKey(reserve.config.liquidityToken.mint) }
					)
				).value[0].pubkey;
			} catch (err) {
				console.log(err); 
				let ata = await createAssociatedTokenAccount(
					connection, // connection
					payer, // fee payer
					new PublicKey(reserve.config.liquidityToken.mint)
					,							new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx")// mint
					);
				  
				  tokenAccount = ata 
			}
			console.log(tinsts.length);
			let instructions = [
				...tinsts,
				flashBorrowReserveLiquidityInstruction(
					amountToTrade,
					new PublicKey(reserve.config.liquidityAddress),
					tokenAccount,
					new PublicKey(reserve.config.address),
					new PublicKey(market.config.address),
					SOLEND_PRODUCTION_PROGRAM_ID
				),
			];
			await Promise.all(
				[swapTransaction.mainTransaction] //, swapTransaction2.mainTransaction]/*, swapTransaction.mainTransaction, swapTransaction.postTransaction,
					//  swapTransaction2.preTransaction/*, swapTransaction2.mainTransaction, swapTransaction2.postTransaction]*/
					.filter(Boolean)
					.map(async (serializedTransaction) => {
						instructions.push(...serializedTransaction.instructions);
					})
			);

			//console.log(instructions.length);
			/*
			for (var instruction of execute2.transactions.swapTransaction.instructions){
				if (!instructions.includes(instruction)){
			instructions.push(instruction)
				}
			} */
			if (process.env.tradingStrategy == "pingpong") {
				console.log(tinsts.length);
				instructions.push(
					flashRepayReserveLiquidityInstruction(
						amountToTrade,
						tinsts.length,
						tokenAccount,
						new PublicKey(reserve.config.liquidityAddress),
						new PublicKey(reserve.config.liquidityFeeReceiverAddress),
						tokenAccount,
						new PublicKey(reserve.config.address),
						new PublicKey(market.config.address),
						payer.publicKey,
						SOLEND_PRODUCTION_PROGRAM_ID
					)
				);
			} else {
				//console.log(jaregm);
				instructions.push(
					fr2(
						amountToTrade,
						tinsts.length,
						tokenAccount,
						new PublicKey(reserve.config.liquidityAddress),
						new PublicKey(reserve.config.liquidityAddress),
						tokenAccount,
						new PublicKey(reserve.config.address),
						new PublicKey(market.config.address),
						payer.publicKey,
						SOLEND_PRODUCTION_PROGRAM_ID,
						jaregm,
						new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx")
					)
				);
			}

			console.log("luts: " + (goaccs.length - 5).toString());
			const messageV00 = new TransactionMessage({
				payerKey: payer.publicKey,
				recentBlockhash: await (
					await connection.getLatestBlockhash()
				).blockhash,
				instructions,
			}).compileToV0Message(goaccs);
			const transaction = new VersionedTransaction(messageV00);
			if (tinsts.length > 0) {
				//	transaction.sign(signers)
			}
			transaction.sign([payer]);
			const connection2 = new Connection(
				process.env.ALT_RPC_LIST.split(",")[
					Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
				]
			);
			let result;
			result = await connection2.sendTransaction(transaction, {skipPreflight: false}, {skipPreflight: false});
			console.log("tx: " + result);

			let tas2 = await connection.getParsedTokenAccountsByOwner(
				payer.publicKey,
				{ mint: new PublicKey(reserve.config.liquidityToken.mint) }
			);

			let jaregms = await connection.getParsedTokenAccountsByOwner(
				new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm"),
				{ mint: new PublicKey(reserve.config.liquidityToken.mint) }
			);

			console.log(tas2.value.length);
			let tac = -1;
			for (var ta of tas2.value) {
				console.log(ta.account.data.parsed.info.tokenAmount.amount);
				if (ta.account.data.parsed.info.tokenAmount.amount > 0) {
					let tx = new Transaction();
					try {
						tx.add(
							createTransferInstruction(
								ta.pubkey, // from (should be a token account)
								jaregms.value[0].pubkey, // to (should be a token account)
								payer.publicKey, // from's owner
								ta.account.data.parsed.info.tokenAmount.amount
							)
						);
					} catch (err) {
						console.log(err);
						let ata = await createAssociatedTokenAccount(
							connection, // connection
							payer, // fee payer
							new PublicKey(reserve.config.liquidityToken.mint),
							new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm") // mint
						);
						tx.add(
							createTransferInstruction(
								ta.pubkey, // from (should be a token account)
								ata, // to (should be a token account)
								payer.publicKey, // from's owner
								parseInt(ta.account.data.parsed.info.tokenAmount.amount)
							)
						);
					}

					tx.recentBlockhash = await (
						await connection.getLatestBlockhash()
					).blockhash;
					tx.sign(payer);
					try {
						connection.sendTransaction(tx, [payer], {
							skipPreflight: false,
							commitment: "singleGossip",
						});
					} catch (err) {
						console.log(err);
					}
				} else {
					tac++;
					if (tac >= 1) {
						await closeAccount(
							new Connection(
								process.env.ALT_RPC_LIST.split(",")[
									Math.floor(
										Math.random() * process.env.ALT_RPC_LIST.split(",").length
									)
								],
								{ commitment: "singleGossip" }
							), // connection
							payer, // payer
							ta.pubkey, // token account which you want to close
							payer.publicKey, // destination
							payer, // owner of token account
							[],
							{ skipPreflight: false }
						);
					}
				}
			}

			//if (process.env.DEBUG) storeItInTempAsJSON("result", result);

			const performanceOfTx = performance.now() - performanceOfTxStart;

			return [result, performanceOfTx];
		} else {
			cache.swappingRightNow = false;

			return [false, false];
		}
	} catch (error) {
		cache.swappingRightNow = false;

		console.log("Swap error: ", error);
		return [false, false];
	}
};
exports.swap = swap;

const failedSwapHandler = (tradeEntry) => {
	// update counter
	cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].fail++;

	// update trade history
	cache.config.storeFailedTxInHistory;

	// update trade history
	let tempHistory = cache.tradeHistory;
	tempHistory.push(tradeEntry);
	cache.tradeHistory = tempHistory;
};
exports.failedSwapHandler = failedSwapHandler;

const successSwapHandler = async (tx1, tradeEntry, tokenA, tokenB) => {
	let tx = { txid: tx1 };
	////if (process.env.DEBUG) storeItInTempAsJSON(`txResultFromSDK_${tx?.txid}`, tx);

	// update counter
	cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].success++;

	if (false) {
		// update balance
		if (cache.sideBuy) {
			cache.lastBalance.tokenA = cache.currentBalance.tokenA;
			cache.currentBalance.tokenA = 0;
			cache.currentBalance.tokenB = tx.outputAmount;
		} else {
			cache.lastBalance.tokenB = cache.currentBalance.tokenB;
			cache.currentBalance.tokenB = 0;
			cache.currentBalance.tokenA = tx.outputAmount;
		}

		// update profit
		if (cache.sideBuy) {
			cache.currentProfit.tokenA = 0;
			cache.currentProfit.tokenB = calculateProfit(
				cache.initialBalance.tokenB,
				cache.currentBalance.tokenB
			);
		} else {
			cache.currentProfit.tokenB = 0;
			cache.currentProfit.tokenA = calculateProfit(
				cache.initialBalance.tokenA,
				cache.currentBalance.tokenA
			);
		}

		// update trade history
		let tempHistory = cache.tradeHistory;

		tradeEntry.inAmount = toDecimal(
			tx.inputAmount,
			cache.sideBuy ? reserve.config.liquidityToken.decimals : tokenB.decimals
		);
		tradeEntry.outAmount = toDecimal(
			tx.outputAmount,
			cache.sideBuy ? tokenB.decimals : reserve.config.liquidityToken.decimals
		);

		tradeEntry.profit = calculateProfit(
			cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"],
			tx.outputAmount
		);
		tempHistory.push(tradeEntry);
		cache.tradeHistory = tempHistory;
	}
	if (true) {
		/** check real amounts on solscan because Jupiter SDK returns wrong amounts
		 *  when we trading TokenA <> TokenA (arbitrage)
		 */
		const [inAmountFromSolscanParser, outAmountFromSolscanParser] =
			await getSwapResultFromSolscanParser(tx?.txid);

		if (inAmountFromSolscanParser === -1)
			console.log(
				`Solscan inputAmount error\n	https://solscan.io/tx/${tx.txid}`
			);
		if (outAmountFromSolscanParser === -1)
			console.log(
				`Solscan outputAmount error\n	https://solscan.io/tx/${tx.txid}`
			);

		cache.lastBalance.tokenA = cache.currentBalance.tokenA;
		cache.currentBalance.tokenA = outAmountFromSolscanParser;

		cache.currentProfit.tokenA = calculateProfit(
			cache.initialBalance.tokenA,
			cache.currentBalance.tokenA
		);

		// update trade history
		let tempHistory = cache.tradeHistory;

		tradeEntry.inAmount = toDecimal(
			inAmountFromSolscanParser,
			reserve.config.liquidityToken.decimals
		);
		tradeEntry.outAmount = toDecimal(
			outAmountFromSolscanParser,
			reserve.config.liquidityToken.decimals
		);

		tradeEntry.profit = calculateProfit(
			cache.lastBalance["tokenA"],
			outAmountFromSolscanParser
		);
		tempHistory.push(tradeEntry);
		cache.tradeHistory = tempHistory;
	}
};
exports.successSwapHandler = successSwapHandler;
