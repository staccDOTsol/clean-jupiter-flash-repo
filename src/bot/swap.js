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
const { createTransferCheckedInstruction } = require("@solana/spl-token");
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
const { createAssociatedTokenAccount } = require("@solana/spl-token");
const { Token, createTransferInstruction } = require('@solana/spl-token');

const swap = async (jupiter, route, route2, tokenA) => {
	if (process.env.tradingStrategy == "arbitrage") {
		SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey(
			"E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa"
		);
	}

	try {
		const performanceOfTxStart = performance.now();

		cache.performanceOfTxStart = performanceOfTxStart;
		let configs = JSON.parse(fs.readFileSync("./configs.json").toString());
		if (process.env.tradingStrategy == "arbitrage") {
			configs = JSON.parse(fs.readFileSync("./configs2.json").toString());
		}
		
		if (true) {
			////if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);

			const execute1 = await jupiter.exchange({
				routeInfo: route,
			});
			/*
		const execute2 = await jupiter.exchange({
			routeInfo: route2,
		}); */
			const connection = new Connection(
				process.env.ALT_RPC_LIST.split(",")[
					Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
				]
			);
			let goluts = [
				"BYCAUgBHwZaVXZsbH7ePZro9YVFKChLE8Q6z4bUvkF1f",
				"5taqdZKrVg4UM2wT6p2DGVY1uFnsV6fce3auQvcxMCya",
				"2V7kVs1TsZv7j38UTv4Dgbc6h258KS8eo5GZL9yhxCjv",
				"9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC",
				"2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi",
			];
			let goaccs = [];
			for (var golut of goluts) {
				goaccs.push(
					(await connection.getAddressLookupTable(new PublicKey(golut))).value
				);
			}
			const luts = JSON.parse(fs.readFileSync("./luts.json").toString());


			console.log(goaccs.length);
			let mint = tokenA.address;

			let reserve, market;
			for (var m of configs.reverse()) {
				let aaa = await SolendMarket.initialize(
					connection,
					"production", // optional environment argument
					new PublicKey(m.address) // optional m address (TURBO SOL). Defaults to 'Main' market
				);
				// 2. Read on-chain accounts for reserve data and cache
				await aaa.loadReserves();
				aaa.reserves = aaa.reserves.filter(
					(reserve) => reserve.stats.reserveBorrowLimit > new BN(0)
				);
				try {
					for (var r of aaa.reserves.reverse()) {
						if (r.config.liquidityToken.mint == mint) {
							reserve = r.config;
							market = aaa;
						}
					}
				} catch (err) {
					console.log(err);
				}
			}
			let jaregm;
			try {
				jaregm = (await connection.getTokenAccountsByOwner(
					new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"),
					{ mint: new PublicKey(tokenA.address) }
				)).value[0].pubkey;
			} catch (err) {
				let hmmm = await createAssociatedTokenAccount(
					connection, // connection
					payer, // fee payer
					new PublicKey(tokenA.address), // mint
					new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx") // owner,
				);

				jaregm = hmmm.address;
			}
			let ata = (
				await connection.getParsedTokenAccountsByOwner(payer.publicKey, {
					mint: new PublicKey(tokenA.address),
				})
			).value[0];
			let tokenAccount;
			try {
				tokenAccount = ata.pubkey;
			} catch (err) {
				let hmm = await createAssociatedTokenAccount(
					connection, // connection
					payer, // fee payer
					new PublicKey(tokenA.address), // mint
					payer.publicKey // owner,
				);

				tokenAccount = hmm.address;
			}
			let instructions = [
				flashBorrowReserveLiquidityInstruction(
					Math.ceil(JSBI.toNumber(route.inAmount) * 2),
					new PublicKey(reserve.liquidityAddress),
					tokenAccount,
					new PublicKey(reserve.address),
					new PublicKey(market.config.address),
					SOLEND_PRODUCTION_PROGRAM_ID
				),
			];
			for (var instruction of execute1.transactions.swapTransaction
				.instructions) {
				if (!instructions.includes(instruction)) {
					instructions.push(instruction);
				}
			}
			console.log(instructions.length);
			/*
			for (var instruction of execute2.transactions.swapTransaction.instructions){
				if (!instructions.includes(instruction)){
			instructions.push(instruction)
				}
			} */
			if (process.env.tradingStrategy == "pingpong") {
				console.log((
					Math.ceil(JSBI.toNumber(route.inAmount) * 2),
					0,
					tokenAccount,
					new PublicKey(reserve.liquidityAddress),
					new PublicKey(reserve.liquidityFeeReceiverAddress),
					tokenAccount,
					new PublicKey(reserve.address),
					new PublicKey(market.config.address),
					payer.publicKey,
					SOLEND_PRODUCTION_PROGRAM_ID
				))
				instructions.push(
					flashRepayReserveLiquidityInstruction(
						Math.ceil(JSBI.toNumber(route.inAmount) * 2),
						0,
						tokenAccount,
						new PublicKey(reserve.liquidityAddress),
						new PublicKey(reserve.liquidityFeeReceiverAddress),
						tokenAccount,
						new PublicKey(reserve.address),
						new PublicKey(market.config.address),
						payer.publicKey,
						SOLEND_PRODUCTION_PROGRAM_ID
					)
				);
			} else {
				console.log(jaregm)
				instructions.push(
					fr2(
						Math.ceil(JSBI.toNumber(route.inAmount) * 2),
						0,
						tokenAccount,
						new PublicKey(reserve.liquidityAddress),
						new PublicKey(reserve.liquidityAddress),
						tokenAccount,
						new PublicKey(reserve.address),
						new PublicKey(market.config.address),
						payer.publicKey,
						SOLEND_PRODUCTION_PROGRAM_ID,
						jaregm,
						new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx")
					)
				);
			}

			let balance = ata.account.data.parsed.info.tokenAmount.amount;
			
	  instructions.push(
		  createTransferInstruction(
			tokenAccount,
			tokenAccount,
			payer.publicKey,
			Math.floor(balance),[]
		  )
		); 
	  

			let tinstructions = [];
			for (var ix of instructions) {
				if (!tinstructions.includes(ix)) {
					tinstructions.push(ix);
				}
			}

			let goaccst = [];
			for (var value of goaccs) {
				try {
					console.log(value.state.addresses.length)
				if (value.state.addresses.length > 0) {
					goaccst.push(value);
				}
			} catch (err){
				console.log(err)
			}
			}
			const messageV00 = new TransactionMessage({
				payerKey: payer.publicKey,
				recentBlockhash: await (
					await connection.getLatestBlockhash()
				).blockhash,
				instructions: tinstructions,
			}).compileToV0Message(goaccst);
			const transaction = new VersionedTransaction(messageV00);
			transaction.sign([payer]);
			const result = await connection.sendTransaction(transaction, {
				maxRetries: 5,
			});
			console.log("tx: " + result);
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
	if (true) {
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
