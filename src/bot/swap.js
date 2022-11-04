const { calculateProfit, toDecimal, storeItInTempAsJSON } = require("../utils");
const cache = require("./cache");
const fs = require('fs')
const JSBI = require('jsbi')
const { getSwapResultFromSolscanParser } = require("../services/solscan");
let { flashRepayReserveLiquidityInstruction, flashBorrowReserveLiquidityInstruction,SOLEND_PRODUCTION_PROGRAM_ID } = require('@solendprotocol/solend-sdk')
const {  createTransferCheckedInstruction } = require('@solana/spl-token');
const BN = require('bn.js')
    
var  { SolendMarket } = require("@solendprotocol/solend-sdk");
if (process.env.tradingStrategy == 'arbitrage'){
	var  { SolendMarket } = require("../../solend-sdk/save/classes/market");

}

const { Keypair, Connection, PublicKey, TransactionMessage, VersionedTransaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const bs58 = require('bs58');

let  payer 
try {
	payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse((fs.readFileSync('./int.json').toString()))))
}
catch {
	payer = Keypair.fromSecretKey(
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);
}
Keypair.fromSecretKey(
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);
	let { 
flashRepayReserveLiquidityInstruction : fr2} = require( "../../solend-sdk/save/instructions/flashRepayReserveLiquidity" );
const { createAssociatedTokenAccount } = require("@solana/spl-token");

const swap = async (jupiter, route, route2, tokenA) => {
if (process.env.tradingStrategy == "arbitrage"){

 SOLEND_PRODUCTION_PROGRAM_ID = new PublicKey("E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa")

	
}

	try {
		
		
		const performanceOfTxStart = performance.now();
		
		cache.performanceOfTxStart = performanceOfTxStart;
		let configs = JSON.parse(fs.readFileSync('./configs.json').toString())
		if (process.env.tradingStrategy == 'arbitrage'){
			configs = JSON.parse(fs.readFileSync('./configs2.json').toString())
		}
		let temp = [] 
		let temp2 = []
		let temp3 = []
		for (var mi of route.marketInfos){
			temp2.push(mi.inputMint.toBase58())

			temp2.push(mi.outputMint.toBase58())
		} /*
		for (var mi of route2.marketInfos){
			temp2.push(mi.inputMint.toBase58())

			temp2.push(mi.outputMint.toBase58())
		} */
		for (var config of configs){
			for (var reserve2 in config.reserves){
				if (parseInt(reserve2) < process.env.tradingStrategy === 'pingpong' ? config.reserves.length / 2 * 3 : config.reserves.length ){
				
					if (process.env.tradingStrategy != 'pingpong'  && parseInt(reserve2) > 1 ){	
						let welike = config.reserves[reserve2].liquidityToken.mint
						if (temp2.includes(welike) && welike != tokenA.address){
							if (!temp3.includes(welike)){
						temp3.push(welike)
							}
							}
				}
				else if (process.env.tradingStrategy != 'arbitrage' ){
					

				}
				}
			}
		}
if (process.env.tradingStrategy == 'pingpong' || temp3.length > 0){
		////if (process.env.DEBUG) storeItInTempAsJSON("routeInfoBeforeSwap", route);

		const execute1 = await jupiter.exchange({
			routeInfo: route,
		});
		/*
		const execute2 = await jupiter.exchange({
			routeInfo: route2,
		}); */
		const connection = new Connection(process.env.ALT_RPC_LIST.split(',')[Math.floor(Math.random()*process.env.ALT_RPC_LIST.split(',').length)], {skipPreflight: false, commitment: 'singleGossip'});
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
		
		let reserve, market 
		for (var m of configs.reverse()){
			 aaa = await SolendMarket.initialize(
				connection,
				"production", // optional environment argument
				new PublicKey(m.address) // optional m address (TURBO SOL). Defaults to 'Main' market
			  );
			  // 2. Read on-chain accounts for reserve data and cache
			  await aaa.loadReserves();
			  config.reserves = (aaa.reserves.filter((reserve) => reserve.stats.reserveBorrowLimit > new BN(0)));
			try {
			for(var r of aaa.reserves.reverse()){
				if (r.config.liquidityToken.mint == mint){
					reserve = r.config
					market = aaa
				}
			}
		} catch (err){
			console.log(err)
		}
		}
		let jaregm 
		try {
		(
			jaregm = await connection.getTokenAccountsByOwner(
				new PublicKey(
					"5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"
				  ),
			  { mint: new PublicKey(tokenA.address) }
			)
		  ).value[0].pubkey
			  } catch (err){
				let [address] = (await createAssociatedTokenAccount(
					connection, // connection
					payer, // fee payer
					new PublicKey(tokenA.address), // mint
					new PublicKey(
						"5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"
					  ), // owner,
				  ))

				  jaregm= address
			  }
		  let ata = (
			await connection.getParsedTokenAccountsByOwner(
			  payer.publicKey,
			  { mint: new PublicKey(tokenA.address) }
			)
	
			).value[0]
	let tokenAccount
			try {
	 tokenAccount = ata.pubkey 
		  } catch (err){
			let [address] = (await createAssociatedTokenAccount(
				connection, // connection
				payer, // fee payer
				new PublicKey(tokenA.address), // mint
				payer.publicKey, // owner,
			  ))

			  jaregm= address
		  }
		let instructions =  [
			flashBorrowReserveLiquidityInstruction(
			  Math.ceil(JSBI.toNumber(route.inAmount) * 2),
			  new PublicKey(reserve.liquidityAddress),
			  tokenAccount,
			  new PublicKey(reserve.address),
			  new PublicKey(market.config.address),
			  SOLEND_PRODUCTION_PROGRAM_ID
			),
		  ];
			  for (var instruction of execute1.transactions.swapTransaction.instructions){
			  if (!instructions.includes(instruction)){
		  instructions.push(instruction)
			  }
			}
		console.log(instructions.length)	
	  /*
			for (var instruction of execute2.transactions.swapTransaction.instructions){
				if (!instructions.includes(instruction)){
			instructions.push(instruction)
				}
			} */
		if (
			process.env.tradingStrategy  == 'pingpong') {	instructions.push(
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
			  new PublicKey(market.config.address),
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
				new PublicKey(market.config.address),
				payer.publicKey,
				SOLEND_PRODUCTION_PROGRAM_ID,
				jaregm,
				new PublicKey(
					"5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"
				  )
				
			  )
			);
				}
				


		console.log(temp3.length)

		console.log(temp3.length)
		console.log(temp3.length)
		console.log(temp3.length)
		console.log(temp3.length)
		
	let balance = ata.account.data.parsed.info.tokenAmount.amount
	console.log(ata.account.data.parsed.info)
	if (process.env.tradingStrategy == 'arbitrage'){
instructions.push(
	createTransferCheckedInstruction(
		tokenAccount, // from (should be a token account)
		new PublicKey(tokenA.address), // mint
		tokenAccount, // to (should be a token account)
		payer.publicKey, // from's owner
		balance == '0' ? 0 : Math.floor(balance / (temp3.length + 1)), // amount, if your deciamls is 8, send 10^8 for 1 token
		tokenA.decimals // decimals
	  )
	  
)
		for (var t of temp3){

			let atat = (
				await connection.getParsedTokenAccountsByOwner(
				  payer.publicKey,
				  { mint: new PublicKey(t) }
				)
			  ).value[0]
		let tokenAccountt = atat.pubkey 
		let balancet = atat.account.data.parsed.info.tokenAmount.amount

		instructions.push(
			createTransferCheckedInstruction(
				tokenAccountt, // from (should be a token account)
				new PublicKey(tokenA.address), // mint
				tokenAccountt, // to (should be a token account)
				payer.publicKey, // from's owner
				balancet == '0' ? 0 : Math.floor(balancet / (temp3.length + 1)), // amount, if your deciamls is 8, send 10^8 for 1 token
				tokenA.decimals // decimals
			  )
			  
		)
		}
	} else {
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
	}
let tinstructions = [] 
for (var ix of instructions){
	if (!tinstructions.includes(ix)){
		tinstructions.push(ix)
	}
}

tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
//tokenB = tokens[Math.floor(Math.random() * tokens.length) % 2]//.find((t) => t.address === cache.config.tokenB.address);
configs = JSON.parse(fs.readFileSync(process.env.tradingStrategy === 'pingpong' ? "./configs.json" : "./configs2.json").toString())

	const conn = (new Connection("https://quaint-old-hill.solana-mainnet.discover.quiknode.pro/1d68cf9ff37548ce6956cf9493ab7e39fd73a352/", {skipPreflight: false,preflightCommitment:'singleGossip', commitment: 'singleGossip'}))
				const  messageV00 = new TransactionMessage({
			payerKey: payer.publicKey,
			recentBlockhash: (await (
				await conn.getLatestBlockhash()
			  ).blockhash),
			instructions:tinstructions,
		}).compileToV0Message(goaccs);
		const transaction = new VersionedTransaction(
					messageV00
				  );
				  transaction.sign([payer])
				const result = await conn.sendTransaction(transaction, {maxRetries: 5})
			console.log('tx: ' + result)
		//if (process.env.DEBUG) storeItInTempAsJSON("result", result);

		const performanceOfTx = performance.now() - performanceOfTxStart;

		return [result, performanceOfTx];
}
else {
	cache.swappingRightNow = false;

	return [false, false]
}
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
