require("dotenv").config();
const { loadConfigFile } = require("../utils");
const fs = require("fs");
const BN = require("bn.js");
const { clearInterval } = require("timers");
const { PublicKey } = require("@solana/web3.js");
const JSBI = require("jsbi");
const WAD = new BN("1".concat(Array(18 + 1).join("0")));

var { SolendMarket } = require("@solendprotocol/solend-sdk");
if (process.env.tradingStrategy == "arbitrage") {
	var { SolendMarket } = require("../../solend-sdk/save/classes/market");
}

const {
	calculateProfit,
	toDecimal,
	toNumber,
	updateIterationsPerMin,
	checkRoutesResponse,
} = require("../utils");
const cache = require("./cache");
const { setup, getInitialOutAmountWithSlippage } = require("./setup");
const { swap, failedSwapHandler, successSwapHandler } = require("./swap");
const { Connection } = require("@solana/web3.js");
const { config } = require("process");
let mod = 10;
const pingpongStrategy = async (jupiter, tokenA, tokenB) => {
	cache.iteration++;
	const date = new Date();
	const i = cache.iteration;
	cache.queue[i] = -1;
let market, reserve
	try {
		cache.config = loadConfigFile({ showSpinner: false });
		// calculate & update iterations per minute
		updateIterationsPerMin(cache);
		tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
		tokenB = tokens[Math.floor(Math.random() * tokens.length) % 2]; //.find((t) => t.address === cache.config.tokenB.address);
		configs = JSON.parse(
			fs
				.readFileSync(
					process.env.tradingStrategy === "pingpong"
						? "./configs.json"
						: "./configs2.json"
				)
				.toString()
		);
//		configs = configs.filter((c) => ((!c.isHidden && c.isPermissionless ) || c.isPrimary))
		const connection = new Connection(
			process.env.ALT_RPC_LIST.split(",")[
				Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
			]
		);

		let temp = [];
		let prices = {};

// configs = configs.filter((c) => c.reserves.filter((r)=>((r.stats.reserveBorrowLimit > new BN(0)))))
let config = configs[Math.floor(Math.random() * configs.length)];
console.log(configs.length)
		 market = await SolendMarket.initialize(
			connection,
			"production", // optional environment argument
			new PublicKey(config.address) // optional m address (TURBO SOL). Defaults to 'Main' market
		);
		// 2. Read on-chain accounts for reserve data and cache
		await market.loadReserves();
		console.log(config.reserves.length)
		config.reserves = market.reserves.filter(
			(reserve) => reserve.stats.totalLiquidityWads / WAD > 0
		);
		console.log(config.reserves.length)
		if (config.reserves.length == 0) return
		let done = false 
				
for (var res of config.reserves){
					if (process.env.tradingStrategy === "arbitrage") {
						temp.push(res.config.liquidityToken.mint);
					} else if (process.env.tradingStrategy != "arbitrage") {
						temp.push(res.config.liquidityToken.mint);
					}

				}
				
				for (var res of config.reserves){

					res = config.reserves[Math.floor(Math.random() * config.reserves.length)]
				 reserve = res//config.reserves[Math.floor(Math.random()* config.reserves.length)]
			
				tokenA = tokens.find((t) => t.address === reserve.config.liquidityToken.mint);
				tokenB = tokenA;
				prices[reserve.config.liquidityToken.mint] =
					reserve.stats.assetPriceUSD;
				let test =	Math.floor(
					(mod / prices[tokenA.address]) * 10 ** tokenA.decimals
				)
				if ((test * 2) < reserve.stats.totalLiquidityWads / WAD){
					done = true
				}
				else {
				}

			}
			if (!done) return
		//tokenB = tokenA
		// Calculate amount that will be used for trade
		const amountToTrade = Math.floor(
			(mod / prices[tokenA.address]) * 10 ** tokenA.decimals
		); /*
			cache.config.tradeSize.strategy === "cumulative"
				? cache.currentBalance[cache.sideBuy ? "tokenA" : "tokenB"]
				: cache.initialBalance[cache.sideBuy ? "tokenA" : "tokenB"];
		*/
		const baseAmount = cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"];

		// default slippage
		const slippage =
			typeof cache.config.slippage === "number" ? cache.config.slippage : 1;

		// set input / output token
		const inputToken = tokenA; //cache.sideBuy ? tokenA : tokenB;
		const outputToken = tokenA; //cache.sideSell ? tokenB : tokenA;
		console.log(inputToken.symbol);
		// check current routes
		const performanceOfRouteCompStart = performance.now();

		const routes = await jupiter.computeRoutes({
			inputMint: new PublicKey(inputToken.address),
			outputMint: new PublicKey(outputToken.address),
			amount: JSBI.BigInt(amountToTrade), // raw input amount of tokens
			slippageBps: 666,

			forceFetch: true,
		});

		// choose first route
		const route =  routes.routesInfos[Math.floor(Math.random() * 1)];
		let ammIds = [];
		try {
			ammIds = JSON.parse(fs.readFileSync("./ammIds.json").toString());
		} catch (err) {}
		let goodluts = [];
		for (var mi of [...route.marketInfos]) {
			for (var abc of (Object.values((mi.amm)))){
				try {
					let hmm = (new PublicKey(abc))
					if (!ammIds.includes(hmm.toBase58())){
						ammIds.push(hmm.toBase58())
					}				}
				catch (err){
					try {
					for (var bca of (Object.values((abc)))){
						try {
							let hmm = (new PublicKey(bca))
							if (!ammIds.includes(hmm.toBase58())){
								ammIds.push(hmm.toBase58())
							}
						}
						catch (err){
						}
					}}
					catch (err){
					}

				}
			}
			//}, ...route2.marketInfos]) {
			try {
				if (!ammIds.includes(mi.amm.id)){

				ammIds.push(mi.amm.id);
				}
			} catch (err) {
				console.log(err);
			}
		}
		fs.writeFileSync("./ammIds.json", JSON.stringify(ammIds));
		/*
		const routes2 = await jupiter.computeRoutes({
			inputMint: new PublicKey(outputToken.address),
			outputMint: new PublicKey(inputToken.address),
			            amount: (JSBI.BigInt(parseInt(((JSBI.toNumber(route.outAmount) * 1.002))))), // raw input amount of tokens
            slippageBps: 99,
			forceFetch: true
		});

		const route2 = await routes2.routesInfos[Math.floor(Math.random() * 1)];
		*/
		const route2 = route;
		// count available routes
		cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
			routes.routesInfos.length; //+ routes2.routesInfos.length;

		// choose another route
		//const route = await routes2.routesInfos[Math.floor(Math.random() * 2)];

		// update status as OK
		cache.queue[i] = 0;

		const performanceOfRouteComp =
			performance.now() - performanceOfRouteCompStart;

		// update slippage with "profit or kill" slippage
		if (cache.config.slippage === "profitOrKill") {
			route.otherAmountThresholdWithSlippage =
				cache.lastBalance[cache.sideBuy ? "tokenB" : "tokenA"];
		}

		let simulatedProfit = calculateProfit(
			JSBI.toNumber(route.inAmount),
			JSBI.toNumber(route2.outAmount)
		);
		if (simulatedProfit > parseFloat(process.env.minPercProfit) ) console.log(simulatedProfit);
		// store max profit spotted
		if (
			simulatedProfit > cache.maxProfitSpotted[cache.sideBuy ? "buy" : "sell"]
		) {
			cache.maxProfitSpotted[cache.sideBuy ? "buy" : "sell"] = simulatedProfit;
		}

		// check profitability and execute tx
		let tx, performanceOfTx;
		if (
			!cache.swappingRightNow &&
			(cache.hotkeys.e ||
				cache.hotkeys.r ||
				simulatedProfit >= parseFloat(process.env.minPercProfit))
		) {
			// hotkeys
			if (cache.hotkeys.e) {
				console.log("[E] PRESSED - EXECUTION FORCED BY USER!");
				cache.hotkeys.e = false;
			}
			if (cache.hotkeys.r) {
				console.log("[R] PRESSED - REVERT BACK SWAP!");
				route.otherAmountThresholdWithSlippage = 0;
			}

			if (cache.tradingEnabled || cache.hotkeys.r) {
				cache.swappingRightNow = true;
				// store trade to the history
				let tradeEntry = {
					date: date.toLocaleString(),
					buy: cache.sideBuy,
					inputToken: inputToken.symbol,
					outputToken: outputToken.symbol,
					inAmount: toDecimal(
						JSBI.toNumber(route.inAmount),
						inputToken.decimals
					),
					expectedOutAmount: toDecimal(
						JSBI.toNumber(route2.outAmount),
						outputToken.decimals
					),
					expectedProfit: simulatedProfit,
				};

				// start refreshing status
				const printTxStatus = setInterval(() => {
					if (cache.swappingRightNow) {
					}
				}, 500);

				[tx, performanceOfTx] = await swap(jupiter, route, route2, tokenA, market, reserve);

				// stop refreshing status
				clearInterval(printTxStatus);
				if (tx) {
					mod = mod * 100;
					successSwapHandler(tx, tradeEntry, tokenA, tokenB);
				}
				if (false) {
					const profit = calculateProfit(
						cache.currentBalance[cache.sideBuy ? "tokenB" : "tokenA"],
						tx.outputAmount
					);

					tradeEntry = {
						...tradeEntry,
						outAmount: tx.outputAmount || 0,
						profit,
						performanceOfTx,
						error: tx.error?.message || null,
					};

					// handle TX results
					if (tx.error) failedSwapHandler(tradeEntry);
					else {
						if (cache.hotkeys.r) {
							console.log("[R] - REVERT BACK SWAP - SUCCESS!");
							cache.tradingEnabled = false;
							console.log("TRADING DISABLED!");
							cache.hotkeys.r = false;
						}
						successSwapHandler(tx, tradeEntry, tokenA, tokenB);
					}
				}
			}
		}
		if (tx) {
			if (!tx.error) {
				// change side
				cache.sideBuy = !cache.sideBuy;
			}
			cache.swappingRightNow = false;
		}
		if (mod > 0.1) {
			if (simulatedProfit > 0) {
				mod = mod * 1.05;
			} else {
				mod = mod / 1.2;
			}
		}
	} catch (error) {
		cache.queue[i] = 1;
		console.log(error);
	} finally {
		delete cache.queue[i];
	}
};

const arbitrageStrategy = async (jupiter, tokenA) => {
	cache.iteration++;
	const date = new Date();
	const i = cache.iteration;
	cache.queue[i] = -1;
	try {
		// calculate & update iterations per minute
		updateIterationsPerMin(cache);

		// Calculate amount that will be used for trade
		const amountToTrade =
			cache.config.tradeSize.strategy === "cumulative"
				? cache.currentBalance["tokenA"]
				: cache.initialBalance["tokenA"];
		const baseAmount = cache.lastBalance["tokenA"];

		// default slippage
		const slippage =
			typeof cache.config.slippage === "number" ? cache.config.slippage : 1;
		// set input / output token
		const inputToken = tokenA;
		const outputToken = tokenA;

		// check current routes
		const performanceOfRouteCompStart = performance.now();
		const routes = await jupiter.computeRoutes({
			inputMint: new PublicKey(inputToken.address),
			outputMint: new PublicKey(outputToken.address),
			inputAmount: amountToTrade,
			slippage,
			forceFetch: true,
		});

		checkRoutesResponse(routes);

		// count available routes
		cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
			routes.routesInfos.length;

		// update status as OK
		cache.queue[i] = 0;

		const performanceOfRouteComp =
			performance.now() - performanceOfRouteCompStart;

		// choose first route
		const route = await routes.routesInfos[0];

		// update slippage with "profit or kill" slippage
		if (cache.config.slippage === "profitOrKill") {
			route.otherAmountThresholdWithSlippage = cache.lastBalance["tokenA"];
		}

		// calculate profitability

		let simulatedProfit = calculateProfit(baseAmount, await route.outAmount);

		// store max profit spotted
		if (simulatedProfit > cache.maxProfitSpotted["buy"]) {
			cache.maxProfitSpotted["buy"] = simulatedProfit;
		}

		// check profitability and execute tx
		let tx, performanceOfTx;
		if (
			!cache.swappingRightNow &&
			(cache.hotkeys.e ||
				cache.hotkeys.r ||
				simulatedProfit >= parseFloat(process.env.minPercProfit))
		) {
			// hotkeys
			if (cache.hotkeys.e) {
				console.log("[E] PRESSED - EXECUTION FORCED BY USER!");
				cache.hotkeys.e = false;
			}
			if (cache.hotkeys.r) {
				console.log("[R] PRESSED - REVERT BACK SWAP!");
				route.otherAmountThresholdWithSlippage = 0;
			}

			if (cache.tradingEnabled || cache.hotkeys.r) {
				cache.swappingRightNow = true;
				// store trade to the history
				let tradeEntry = {
					date: date.toLocaleString(),
					buy: cache.sideBuy,
					inputToken: inputToken.symbol,
					outputToken: outputToken.symbol,
					inAmount: toDecimal(
						JSBI.toNumber(route.inAmount),
						inputToken.decimals
					),
					expectedOutAmount: toDecimal(route.outAmount, outputToken.decimals),
					expectedProfit: simulatedProfit,
				};

				// start refreshing status
				const printTxStatus = setInterval(() => {
					if (cache.swappingRightNow) {
					}
				}, 500);

				[tx, performanceOfTx] = await swap(jupiter, route);

				// stop refreshing status
				clearInterval(printTxStatus);

				const profit = calculateProfit(
					cache.currentBalance[cache.sideBuy ? "tokenB" : "tokenA"],
					tx.outputAmount
				);

				tradeEntry = {
					...tradeEntry,
					outAmount: tx.outputAmount || 0,
					profit,
					performanceOfTx,
					error: tx.error?.message || null,
				};

				// handle TX results
				if (tx.error) failedSwapHandler(tradeEntry);
				else {
					if (cache.hotkeys.r) {
						console.log("[R] - REVERT BACK SWAP - SUCCESS!");
						cache.tradingEnabled = false;
						console.log("TRADING DISABLED!");
						cache.hotkeys.r = false;
					}
					successSwapHandler(tx, tradeEntry, tokenA, tokenA);
				}
			}
		}

		if (tx) {
			cache.swappingRightNow = false;
		}
	} catch (error) {
		cache.queue[i] = 1;
		throw error;
	} finally {
		delete cache.queue[i];
	}
};

const watcher = async (jupiter, tokenA, tokenB) => {
	if (
		!cache.swappingRightNow &&
		Object.keys(cache.queue).length < cache.queueThrottle
	) {
		if (process.env.tradingStrategy === "pingpong") {
			await pingpongStrategy(jupiter, tokenA, tokenB);
		}
		if (process.env.tradingStrategy === "arbitrage") {
			await pingpongStrategy(jupiter, tokenA, tokenB);
			//await arbitrageStrategy(jupiter, tokenA, tokenB);
		}
	}
};

const run = async () => {
	try {
		// set everything up
		const { jupiter, tokenA, tokenB } = await setup();

		if (true) {
			//process.env.tradingStrategy === "pingpong") {
			// set initial & current & last balance for tokenA
			cache.initialBalance.tokenA = toNumber(
				cache.config.tradeSize.value,
				tokenA.decimals
			);
			cache.currentBalance.tokenA = cache.initialBalance.tokenA;
			cache.lastBalance.tokenA = cache.initialBalance.tokenA;
			// set initial & last balance for tokenB
			cache.initialBalance.tokenB = 0;
			cache.lastBalance.tokenB = cache.initialBalance.tokenB;
		} else if (false) {
			//process.env.tradingStrategy === "arbitrage") {
			// set initial & current & last balance for tokenA
			cache.initialBalance.tokenA = toNumber(
				cache.config.tradeSize.value,
				tokenA.decimals
			);
			cache.currentBalance.tokenA = cache.initialBalance.tokenA;
			cache.lastBalance.tokenA = cache.initialBalance.tokenA;
		}

		global.botInterval = setInterval(
			() => watcher(jupiter, tokenA, tokenA),
			cache.config.minInterval
		);
	} catch (error) {
		console.log(error);
		process.exitCode = 1;
	}
};
run();
