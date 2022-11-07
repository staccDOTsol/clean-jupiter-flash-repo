const { calculateProfit, toDecimal, storeItInTempAsJSON } = require("../utils");
const cache = require("./cache");
const { closeAccount, createTransferInstruction, createAssociatedTokenAccount } = require ('../../src/spl-token')
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
let market = JSON.parse(fs.readFileSync("./configs.json").toString())[0];
let payer = Keypair.fromSecretKey(
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);
const swap = async (
	jupiter,
	route,
	route2,
	tokenA,
	market,
	reserve,
	amountToTrade) => {
	try {
		const performanceOfTxStart = performance.now();
		cache.performanceOfTxStart = performanceOfTxStart;
		let connection = new Connection(
			cache.config.rpc[Math.floor(Math.random() * cache.config.rpc.length)]
		);

		const reserve = market.reserves.find(
			(res) => res.config.liquidityToken.mint === tokenA.address
		);

		//if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);
		let units = 266642;
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
		const execute = await jupiter.exchange({
			routeInfo: route,
		});
		//	const execute2 = await jupiter.exchange({
	//		routeInfo: route2,
//		});
		let ata = (
			await connection.getParsedTokenAccountsByOwner(payer.publicKey, {
				mint: new PublicKey(reserve.config.liquidityToken.mint),
			})
		).value;
		let tokenAccount;
		try {
			tokenAccount = ata[0].pubkey;
		} catch (err) {
			/*
			let ata = await createAssociatedTokenAccount(
				connection, // connection
				payer, // fee payer
				new PublicKey(reserve.config.liquidityToken.mint),
				payer.publicKey // mint
			);

			tokenAccount = ata;
		*/
		}
		if (ata.length > 0){
			for (var i = 1; i < ata.length; i++){
				try{
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
				[],
				{ skipPreflight: false }
			);
		} catch (Err){
			
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
			luts = JSON.parse(fs.readFileSync("./tluts.json").toString());
		} catch (err) {
			try {
			} catch (err) {
				luts = JSON.parse(fs.readFileSync("./luts.json").toString());
			}
		}
		for (var golut of goluts) {
			connection = new Connection(
				process.env.ALT_RPC_LIST.split(",")[
					Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
				]
			);
			let test= (await connection.getAddressLookupTable(new PublicKey(golut))).value
			if (test.state.deactivationSlot < BigInt(159408000 * 2)						){
			goaccs.push(
				test
			);
			}
		}
		for (var mi of route.marketInfos) {
		
			try {
			for (var lut of luts[mi.amm.id]) {
				try {
					let test= (await connection.getAddressLookupTable(new PublicKey(lut))).value
					if (test.state.deactivationSlot < BigInt(159408000 * 2)						){
					goaccs.push(
						test
					);
					}
				} catch (err) {}
			}
		} catch (err) {}
		}
		let jaregm;
		try {
			jaregm = (
				await connection.getTokenAccountsByOwner(
					new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"),
					{ mint: new PublicKey(reserve.config.liquidityToken.mint) }
				)
			).value[0].pubkey;
		} catch (err) {
			
			let ata = await createAssociatedTokenAccount(
				connection, // connection
				payer, // fee payer
				new PublicKey(reserve.config.liquidityToken.mint),
				new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx") // mint
			);
			jaregm = ata
		}
		//tinsts = []
		let instructions = [
			...tinsts,
			flashBorrowReserveLiquidityInstruction(
				JSBI.toNumber(route.inAmount),
				new PublicKey(reserve.config.liquidityAddress),
				tokenAccount,
				new PublicKey(reserve.config.address),
				new PublicKey(market.config.address),
				SOLEND_PRODUCTION_PROGRAM_ID
			),
			...execute.transactions.swapTransaction.instructions,
			//...execute2.transactions.swapTransaction.instructions,
			flashRepayReserveLiquidityInstruction(
				JSBI.toNumber(route.inAmount),
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
			) /*, 
			jaregm,
			new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"))*/,
		];
		//	console.log(execute.transactions.swapTransaction.instructions.length)

		//	execute.transactions.swapTransaction.instructions = instructions
		//	console.log(execute.transactions.swapTransaction.instructions.length)
		console.log("luts: " + (goaccs.length - 5).toString());
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
			]
		);
		let result;
		result = await sendAndConfirmTransaction(connection2,
			transaction,
			{ skipPreflight: false },
			{ skipPreflight: false }
		);
		console.log("tx: " + result);

		let tas2 = await connection.getParsedTokenAccountsByOwner(payer.publicKey, {
			mint: new PublicKey(reserve.config.liquidityToken.mint),
		});

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
						skipPreflight: true,
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

		const performanceOfTx = performance.now() - performanceOfTxStart;

		return [result, performanceOfTx];
	} catch (error) {
		console.log("Swap error: ", error);
		cache.swappingRightNow = false
		return [0, 0]
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
 
	if (cache.config.tradingStrategy === "pingpong") {
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
			cache.sideBuy ? tokenA.decimals : tokenB.decimals
		);
		tradeEntry.outAmount = toDecimal(
			tx.outputAmount,
			cache.sideBuy ? tokenB.decimals : tokenA.decimals
		);

		tradeEntry.profit = calculateProfit(
			cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"],
			tx.outputAmount
		);
		tempHistory.push(tradeEntry);
		cache.tradeHistory = tempHistory;
	}
	if (cache.config.tradingStrategy === "arbitrage") {
		/** check real amounts on solscan because Jupiter SDK returns wrong amounts
		 *  when we trading TokenA <> TokenA (arbitrage)
		 */
		const [inAmountFromSolscanParser, outAmountFromSolscanParser] =
			await getSwapResultFromSolscanParser(tx?.txid);

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
