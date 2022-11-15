const { calculateProfit, toDecimal, storeItInTempAsJSON } = require("../utils");
const cache = require("./cache");
const BN = require("bn.js");
const {
	closeAccount,
	createTransferInstruction,
	createAssociatedTokenAccount,
	getOrCreateAssociatedTokenAccount,
} = require("../../src/spl-token");
const { getSwapResultFromSolscanParser } = require("../services/solscan");
const {
	flashRepayReserveLiquidityInstruction,
} = require("../../solend-sdk/save/instructions/flashRepayReserveLiquidity");
const {
	flashBorrowReserveLiquidityInstruction,
} = require("@solendprotocol/solend-sdk");
const {
	ComputeBudgetProgram,
	PublicKey,
	Connection,
	Keypair,
	TransactionMessage,
	VersionedTransaction,
	Transaction,
	sendAndConfirmTransaction,
} = require("@solana/web3.js");
var SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey(
	"E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa"
);
const JSBI = require("jsbi");
const bs58 = require("bs58");
const fs = require("fs");
const { env } = require("process");
let market = JSON.parse(fs.readFileSync("./configs.json").toString())[0];
let payer = Keypair.fromSecretKey(
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);

process.on("uncaughtException", (err) => {
	console.log(err);
});
process.on("unhandledRejection", (reason, promise) => {
	console.log(reason);
});
const swap = async (
	jupiter,
	prism,
	route,
	route2,
	tokenA,
	market,
	reserve,
	amountToTrade
) => {
	try {
		const performanceOfTxStart = performance.now();
		cache.performanceOfTxStart = performanceOfTxStart;
		let connection = new Connection(
			cache.config.rpc[Math.floor(Math.random() * cache.config.rpc.length)],
			{ confirmTransactionInitialTimeout: 33333 }
		);

		const reserve = market.reserves.find(
			(res) => res.config.liquidityToken.mint === tokenA.address
		);
		//console.log(reserve)

		//if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);
		let units = 2796642;
		let tinsts = [];
		const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
			//234907
			units: units,
		});

		const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
			microLamports: Math.floor((units / 1000000) * 150),
		});

		tinsts.push(modifyComputeUnits);
		tinsts.push(addPriorityFee);
		var execute;

		if (process.env.tradingStrategy == "arbitrage")
			execute = await jupiter.exchange({ routeInfo: route });

		var swapTransaction;

		if (process.env.tradingStrategy != "arbitrage")
			swapTransaction = await prism.generateSwapTransactions(route);

		let ata = (
			await connection.getParsedTokenAccountsByOwner(payer.publicKey, {
				mint: new PublicKey(reserve.config.liquidityToken.mint),
			})
		).value;
		let tokenAccount;
		try {
			tokenAccount = ata[0].pubkey;
		} catch (err) {
			let ata2 = await getOrCreateAssociatedTokenAccount(
				connection, // connection
				payer, // fee payer
				new PublicKey(reserve.config.liquidityToken.mint),
				payer.publicKey,
				true // mint
			);

			tokenAccount = ata2.address;
		}
		if (ata.length > 1) {
			for (var i = 2; i <= ata.length; i++) {
				try {
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
						ata[i].pubkey, // token account which you want to close
						payer.publicKey, // destination
						payer, // owner of token account
						[]
					);
				} catch (Err) {
					console.log(Err);
				}
			}
		}
		let goaccs = [];
		let goluts = [
			"BYCAUgBHwZaVXZsbH7ePZro9YVFKChLE8Q6z4bUvkF1f",
			"5taqdZKrVg4UM2wT6p2DGVY1uFnsV6fce3auQvcxMCya",
			"2V7kVs1TsZv7j38UTv4Dgbc6h258KS8eo5GZL9yhxCjv",
			"9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC",
			"2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi",
		];

		let luts = {};
		try {
			luts = JSON.parse(fs.readFileSync("./luts.json").toString());
		} catch (err) {
			console.log(err);
		}
		for (var golut of goluts) {
			connection = new Connection(
				process.env.ALT_RPC_LIST.split(",")[
					Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
				],
				{ confirmTransactionInitialTimeout: 33333 }
			);
			let test = (await connection.getAddressLookupTable(new PublicKey(golut)))
				.value;
			if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
				goaccs.push(test);
			}
		}
		let templuts = [];
		try {
			for (var mi of [...route.marketInfos]) {
				try {
					for (var lut of luts[mi.amm.id]) {
						templuts.push(lut);
					}
				} catch (err) {}
			}
		} catch (err) {}
		let counts = {};
		try {
			for (var lut of templuts) {
				for (var mi of [...route.marketInfos]) {
					if (!Object.keys(counts).includes(lut)) {
						counts[lut] = 0;
					}
					try {
						if (luts[mi.amm.id].includes(lut)) {
							counts[lut]++;
						}
					} catch (err) {}
				}
			}
		} catch (err) {}
		let fluts = [];
		for (var alut of Object.keys(counts)) {
			if (counts[alut] >= 1) {
				fluts.push(alut);
			}
		}
		try {
			for (var lut of fluts) {
				try {
					let test = (
						await connection.getAddressLookupTable(new PublicKey(lut))
					).value;
					if (
						test.state.deactivationSlot > BigInt(159408000 * 2) &&
						goaccs.length < 15
					) {
						goaccs.push(test);
					}
				} catch (err) {}
			}
		} catch (err) {}

		let ammIds = [];
		let ammIdspks = [];
		try {
			for (var file of [route]) {
				//},...routes2]){//{//}),...routes2]){
				try {
					for (var rd of Object.values(file.routeData)) {
						try {
							// @ts-ignore
							for (var rd2 of Object.values(rd.routeData)) {
								try {
									try {
										// @ts-ignore

										if (rd2.orcaPool != undefined) {
											let dothedamnthing = rd2.oracaPool.orcaTokenSwapId;
											if (!ammIdspks.includes(dothedamnthing.toBase58())) {
												// @ts-ignore

												ammIdspks.push(dothedamnthing.toBase58());
												ammIds.push(dothedamnthing);
											}
										}
									} catch (err) {}
									if (rd2.ammId != undefined) {
										// @ts-ignore
										let dothedamnthing = new PublicKey(rd2.ammId);
										// @ts-ignore
										if (!ammIdspks.includes(dothedamnthing.toBase58())) {
											// @ts-ignore

											ammIdspks.push(dothedamnthing.toBase58());
											ammIds.push(dothedamnthing);
										}
									}
									if (rd2.swapAccount != undefined) {
										// @ts-ignore
										let dothedamnthing = new PublicKey(rd2.swapAccount);
										// @ts-ignore
										if (!ammIdspks.includes(dothedamnthing.toBase58())) {
											// @ts-ignore

											ammIdspks.push(dothedamnthing.toBase58());
											ammIds.push(dothedamnthing);
										}
									}
								} catch (err) {}
							}
						} catch (err) {}
					}
				} catch (err) {}
			}
		} catch (err) {}

		for (var lut of ammIds) {
			if (goaccs.length < 20) {
				try {
					let test = (
						await connection.getAddressLookupTable(new PublicKey(lut))
					).value;
					if (test.state.deactivationSlot > BigInt(159408000 * 2)) {
						goaccs.push(test);
					}
				} catch (err) {}
			}
		}
		let jaregm;

		try {
			jaregm = (
				await getOrCreateAssociatedTokenAccount(
					connection, // connection
					payer, // fee payer
					new PublicKey(reserve.config.liquidityToken.mint),
					new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm"),
					true
				)
			).address;
		} catch (err) {
			try {
				let ata = (
					await getOrCreateAssociatedTokenAccount(
						connection, // connection
						payer, // fee payer
						new PublicKey(reserve.config.liquidityToken.mint),
						new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm"),
						true // mint
					)
				).address;
				jaregm = ata;
			} catch (err) {
				console.log(err);
			}
		}
		console.log(jaregm.toBase58());
		//tinsts = []
		//console.log(execute.transactions)
		/*
			let tx = new Transaction();
		if (execute.transactions.setupTransaction){
		

			tx.add(...execute.transactions.setupTransaction.instructions)
			tx.recentBlockhash = await (
				await connection.getLatestBlockhash()
			).blockhash;
			tx.sign(payer);
			try {
				
			} catch (err) {
				console.log(err);
			}
		}
		else {
		//	process.exit()
		}
		if (swapTransaction.preTransaction.instructions.length > 0){
		

			try {
			tx.add(...swapTransaction.preTransaction.instructions)
			tx.recentBlockhash = await (
				await connection.getLatestBlockhash()
			).blockhash;
			tx.sign(payer);
				
			} catch (err) {
				console.log(err);
			}
		}
		if (tx.instructions.length >0){
			const messageV00 = new TransactionMessage({
				payerKey: payer.publicKey,
				recentBlockhash: await (await connection.getLatestBlockhash()).blockhash,
				instructions:tx.instructions,
			}).compileToV0Message(goaccs);
			const transaction = new VersionedTransaction(messageV00);
		let hmm =  await connection.sendTransaction(
			transaction, [payer]
			);
		console.log('hmm: ' + hmm)
		} */
		let inAmount;
		if (process.env.tradingStrategy != "arbitrage") {
			inAmount = route.amountIn * 10 ** tokenA.decimals;
		} else {
			try {
				inAmount = JSBI.toNumber(route.inAmount);
			} catch (err) {
				inAmount = route.inAmount;
			}
		}
		console.log(inAmount);
		let thepaydirt =
			process.env.tradingStrategy == "arbitrage"
				? execute.transactions.swapTransaction.instructions
				: swapTransaction.mainTransaction.instructions;
		process.env.tradingStrategy == "arbitrage" && thepaydirt.length > 1
			? (thepaydirt = [thepaydirt[1]])
			: null;
		let instructions = [
			...tinsts,
			flashBorrowReserveLiquidityInstruction(
				inAmount,
				new PublicKey(reserve.config.liquidityAddress),
				tokenAccount,
				new PublicKey(reserve.config.address),
				new PublicKey(market.config.address),
				SOLEND_PRODUCTION_PROGRAM_ID
			),
			...thepaydirt,
			flashRepayReserveLiquidityInstruction(
				inAmount,
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
				new PublicKey(reserve.config.liquidityToken.mint)
			),
			createTransferInstruction(
				tokenAccount, // from (should be a token account)
				tokenAccount, // to (should be a token account)
				payer.publicKey, // from's owner
				ata[0].account.data.parsed.info.tokenAmount.amount
			) /*, 
			jaregm,
			new PublicKey("JARehRjGUkkEShpjzfuV4ERJS25j8XhamL776FAktNGm"))*/,
		];
		//	console.log(execute.transactions.swapTransaction.instructions.length)

		//	execute.transactions.swapTransaction.instructions = instructions
		//	console.log(execute.transactions.swapTransaction.instructions.length)
		console.log("luts: " + (goaccs.length - 5).toString());
		console.log(reserve.config.liquidityToken.mint);
		//console.log(...instructions)
		const messageV00 = new TransactionMessage({
			payerKey: payer.publicKey,
			recentBlockhash: await (await connection.getLatestBlockhash()).blockhash,
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
			],
			{ confirmTransactionInitialTimeout: 33333 }
		);
		let result;
		try {
			result = await sendAndConfirmTransaction(
				connection2,
				transaction,
				{ skipPreflight: false },
				{ skipPreflight: false }
			);
			console.log("tx: " + result);
		} catch (err) {
			console.log(err);
		}
		const performanceOfTx = performance.now() - performanceOfTxStart;

		return [result, performanceOfTx];
	} catch (error) {
		console.log("Swap error: ", error);
		cache.swappingRightNow = false;
		return [0, 0];
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

const successSwapHandler = async (tx, tradeEntry, tokenA, tokenB) => {
	//if (process.env.DEBUG) storeItInTempAsJSON(`txResultFromSDK_${tx?.txid}`, tx);

	// update counter
	cache.tradeCounter[cache.sideBuy ? "buy" : "sell"].success++;

	if (cache.config.tradingStrategy === "arbitrage") {
		/** check real amounts on solscan because Jupiter SDK returns wrong amounts
		 *  when we trading TokenA <> TokenA (arbitrage)
		 */
		const [inAmountFromSolscanParser, outAmountFromSolscanParser] =
			await getSwapResultFromSolscanParser(tx?.txid);
		console.log("inininin " + inAmountFromSolscanParser.toString());
		console.log("outoutout " + outAmountFromSolscanParser.toString());

		if (inAmountFromSolscanParser === -1)
			throw new Error(
				`Solscan inputAmount error\n	https://solscan.io/tx/${tx.txid}`
			);
		if (outAmountFromSolscanParser === -1)
			throw new Error(
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

		tradeEntry.inAmount = toDecimal(inAmountFromSolscanParser, tokenA.decimals);
		tradeEntry.outAmount = toDecimal(
			outAmountFromSolscanParser,
			tokenA.decimals
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
