const { calculateProfit, toDecimal, storeItInTempAsJSON } = require("../utils");
const cache = require("./cache");
const fs = require('fs')
const JSBI = require('jsbi')
const { getSwapResultFromSolscanParser } = require("../services/solscan");
let { flashRepayReserveLiquidityInstruction, flashBorrowReserveLiquidityInstruction,SOLEND_PRODUCTION_PROGRAM_ID } = require('@solendprotocol/solend-sdk')
const {  createTransferCheckedInstruction } = require('@solana/spl-token');


const { Keypair, Connection, PublicKey, TransactionMessage, VersionedTransaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const bs58 = require('bs58');

const payer = Keypair.fromSecretKey(
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);
	let { 
flashRepayReserveLiquidityInstruction : fr2} = require( "../../solend-sdk/save/instructions/flashRepayReserveLiquidity" );

const swap = async (jupiter, route, route2, tokenA) => {
if (cache.config.tradingStrategy == "arbitrage"){

 SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey("E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa")

	
}

	try {
		const performanceOfTxStart = performance.now();
		cache.performanceOfTxStart = performanceOfTxStart;

		////if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);

		const execute1 = await jupiter.exchange({
			routeInfo: route,
		});
		
//		const execute2 = await jupiter.exchange({
//			routeInfo: route2,
//		});
		const connection = new Connection(process.env.ALT_RPC_LIST.split(',')[Math.floor(Math.random()*process.env.ALT_RPC_LIST.split(',').length)], 'confirmed');
		let goaccs = [(await connection.getAddressLookupTable(new PublicKey("2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi"))).value]
		const luts = JSON.parse(fs.readFileSync('./luts.json').toString())
		let ammIds = [ ]
try {
			ammIds =  JSON.parse(fs.readFileSync('./ammIds.json').toString())
			
} catch (err){
}
let goodluts = []
		for (var mi of [...route.marketInfos,...route2.marketInfos]){

			try {
				ammIds.push(mi.amm.id)
				console.log(mi.amm.id)
			for (var lut of luts[mi.amm.id]){
				try {
					if (!goodluts.includes(mi.amm.id)){
						goodluts.push(mi.amm.id)
			let test = (await connection.getAddressLookupTable(new PublicKey(lut))).value
			if (!goaccs.includes(test)){
			goaccs.push(test)
			}
		}
				}catch (err){

				}
			}
		}
		catch (err){
console.log(err)
		}
		}
		fs.writeFileSync('./ammIds.json',JSON.stringify(ammIds))

		console.log(goaccs.length)
		let mint = (tokenA.address)
		let configs = JSON.parse(fs.readFileSync('./configs.json').toString())
		if (cache.config.tradingStrategy == 'arbitrage'){
			configs = JSON.parse(fs.readFileSync('./configs2.json').toString())
		}
		let reserve, market 
		for (var m of configs.reverse()){
			try {
			for(var r of m.reserves.reverse()){
				if (r.liquidityToken.mint == mint){
					market = m 
					reserve = r 
				}
			}
		} catch (err){
			console.log(err)
		}
		}
		let jaregm = (
			await connection.getTokenAccountsByOwner(
			  new PublicKey(
				"5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"
			  ),
			  { mint: new PublicKey(tokenA.address) }
			)
		  ).value[0].pubkey
		let ata = (
			await connection.getParsedTokenAccountsByOwner(
			  payer.publicKey,
			  { mint: new PublicKey(tokenA.address) }
			)
		  ).value[0]
	let tokenAccount = ata.pubkey 
	let balance = ata.account.data.parsed.info.tokenAmount.amount
		let instructions =  [
			flashBorrowReserveLiquidityInstruction(
			  Math.ceil(JSBI.toNumber(route.inAmount) * 2),
			  new PublicKey(reserve.liquidityAddress),
			  tokenAccount,
			  new PublicKey(reserve.address),
			  new PublicKey(market.address),
			  SOLEND_PRODUCTION_PROGRAM_ID
			),
		  ];
			  for (var instruction of execute1.transactions.swapTransaction.instructions){
			  if (!instructions.includes(instruction)){
		  instructions.push(instruction)
			  }
			}
		console.log(instructions.length)	
	  
			/*	for (var instruction of execute2.transactions.swapTransaction.instructions){
				if (!instructions.includes(instruction)){
			instructions.push(instruction)
				}
			}*/
		if (
			cache.config.tradingStrategy  == 'pingpong') {	instructions.push(
			flashRepayReserveLiquidityInstruction(
			  
				Math.ceil(JSBI.toNumber(route.inAmount) * 2),
				0,
			  tokenAccount,
			  new PublicKey(
				reserve.liquidityAddress
			  ),
			  new PublicKey(
				reserve.liquidityFeeReceiverAddress
			  ),
tokenAccount,
			  new PublicKey(reserve.address),
			  new PublicKey(market.address),
			  payer.publicKey,
			  SOLEND_PRODUCTION_PROGRAM_ID
			) )
			  } else { 
		  instructions.push(
			  fr2(
				
				  Math.ceil(JSBI.toNumber(route.inAmount) * 2),
				  0,
				tokenAccount,
				new PublicKey(
				  reserve.liquidityAddress
				),
				new PublicKey(
				  reserve.liquidityAddress
				),
				tokenAccount,
				new PublicKey(reserve.address),
				new PublicKey(market.address),
				payer.publicKey,
				SOLEND_PRODUCTION_PROGRAM_ID,
				jaregm,
				new PublicKey(
					"5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"
				  )
				
			  )
			);
				}
instructions.push(
				createTransferCheckedInstruction(
					tokenAccount, // from (should be a token account)
					new PublicKey(tokenA.address), // mint
					tokenAccount, // to (should be a token account)
					payer.publicKey, // from's owner
					balance, // amount, if your deciamls is 8, send 10^8 for 1 token
					tokenA.decimals // decimals
				  )
)
let tinstructions = [] 
for (var ix of instructions){
	if (!tinstructions.includes(ix)){
		tinstructions.push(ix)
	}
}
				const  messageV00 = new TransactionMessage({
			payerKey: payer.publicKey,
			recentBlockhash: (await (
				await connection.getLatestBlockhash()
			  ).blockhash),
			instructions:tinstructions,
		}).compileToV0Message(goaccs);
		const transaction = new VersionedTransaction(
					messageV00
				  );
				  transaction.sign([payer])
				const result = await connection.sendTransaction(transaction, {skipPreflight: true})
			console.log('tx: ' + result)
		//if (process.env.DEBUG) storeItInTempAsJSON("result", result);

		const performanceOfTx = performance.now() - performanceOfTxStart;

		return [result, performanceOfTx];
	} catch (error) {
		cache.swappingRightNow = false;

		console.log("Swap error: ", error);
		return [false, false]
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
	let tx = {txid: tx1}
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
