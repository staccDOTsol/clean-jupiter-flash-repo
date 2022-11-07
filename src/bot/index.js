require("dotenv").config();
const { loadConfigFile } = require("../utils");
const fs = require("fs");
const BN = require("bn.js");
const { clearInterval } = require("timers");
const { PublicKey } = require("@solana/web3.js");
const JSBI = require("jsbi");
const WAD = new BN("1".concat(Array(18 + 1).join("0")));
const bs58 = require("bs58");
const {
	calculateProfit,
	toDecimal,
	toNumber,
	updateIterationsPerMin,
	checkRoutesResponse,
} = require("../utils");
const cache = require("./cache");
const { setup, getInitialamountWithFeesWithSlippage } = require("./setup");
const { swap, failedSwapHandler, successSwapHandler } = require("./swap");
const { Connection } = require("@solana/web3.js");
const { config } = require("process");
let mod = process.env.tradingStrategy == "arbitrage" ? 100: 1000;
const pingpongStrategy = async (
	jupiter,
	tokenA,
	tokenB,
	market,
	reserve,
	prices
) => {
	cache.iteration++;
	const date = new Date();
	const i = cache.iteration;
	cache.queue[i] = -1;
	try {
		cache.config = loadConfigFile({ showSpinner: false });
		// calculate & update iterations per minute
		updateIterationsPerMin(cache);
		//tokenB = tokenA
		// Calculate amount that will be used for trade
		const amountToTrade = Math.floor(
			(mod / reserve.stats.assetPriceUSD) *
				10 ** reserve.config.liquidityToken.decimals
		);
		//console.log(
		///	"amountToTrade: " + (amountToTrade / 10 ** tokenA.decimals).toString()
		//);
		/*
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
		//console.log(inputToken.symbol);
		// check current routes
		const performanceOfRouteCompStart = performance.now();

		await jupiter.loadRoutes(tokenA.address, tokenB.address);
		const routes = jupiter.getRoutes(amountToTrade / 10 ** tokenA.decimals);

		// choose first route
		const route = routes[Math.floor(Math.random() * 2)];
		if (!route) return;
		let ammIds = [];
		try {
			ammIds = JSON.parse(fs.readFileSync("./ammIds.json").toString());
		} catch (err) {}
		let goodluts = [];

		try {
			if (!goodies.includes(reserve.config.liquidityToken.mint)) {
				goodies.push(reserve.config.liquidityToken.mint);
				console.log(
					"g: " +
						goodies.length.toString() +
						" & res length: " +
						market.reserves.length.toString()
				);
			}
		} catch (err) {}
		try {
			let ammIds = [];
			let ammIdspks = [];
			try {
				ammIds = JSON.parse(fs.readFileSync("./ammIds.json").toString());

				ammIdspks = JSON.parse(fs.readFileSync("./ammIdspks.json").toString());
			} catch (err) {}
			
			for (var file of [...routes]) {
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
													let test = new PublicKey(rd2[rd3]).toBase58();
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
				fs.writeFileSync("./ammIds.json", JSON.stringify(ammIds));
		
		} catch (Err) {
			console.log(Err);
		}

		await jupiter.loadRoutes(tokenB.address, tokenA.address);
		/*	const routes2 = jupiter.getRoutes(route.amountWithFees * 1.0002)
		
				// choose first route
				const route2 = routes2[Math.floor(Math.random() * 1)];
				if (!route2) return */
		// count available routes

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
		let route2 = route;
		let simulatedProfit = calculateProfit(route.amountIn, route2.amountWithFees);
		if (simulatedProfit > parseFloat(process.env.minPercProfit))
			console.log(simulatedProfit);
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
					amountIn: toDecimal(route.amountIn, inputToken.decimals),
					expectedamountWithFees: toDecimal(route2.amountWithFees, outputToken.decimals),
					expectedProfit: simulatedProfit,
				};

				// start refreshing status
				const printTxStatus = setInterval(() => {
					if (cache.swappingRightNow) {
					}
				}, 500);

				[tx, performanceOfTx] = await swap(
					jupiter,
					route,
					route2,
					tokenA,
					market,
					reserve,
					amountToTrade
				);

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
						amountWithFees: tx.outputAmount || 0,
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
				mod = mod * 1.01;
			} else {
				mod = mod / 1.09;
			}
		} else {
			mod = process.env.tradingStrategy == "arbitrage" ? 100: 1000;
		}
		console.log("mod: " + mod.toString());
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

		let simulatedProfit = calculateProfit(baseAmount, await route.amountWithFees);

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
					amountIn: toDecimal(route.amountIn, inputToken.decimals),
					expectedamountWithFees: toDecimal(route.amountWithFees, outputToken.decimals),
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
					amountWithFees: tx.outputAmount || 0,
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

const watcher = async (jupiter, tokenA, tokenB, market) => {
	if (
		!cache.swappingRightNow &&
		Object.keys(cache.queue).length < cache.queueThrottle
	) {
		let done = false;

		let prices = {};
		done = false;
		market.refreshAll();
		for (var res of market.reserves) {
			res = market.reserves[Math.floor(Math.random() * market.reserves.length)];
			reserve = res; //market.reserves[Math.floor(Math.random()* market.reserves.length)]
			let symbol =
				process.env.tradingStrategy == "arbitrage"
					? reserve.config.asset
					: reserve.config.liquidityToken.symbol;

			tokenA = {
				address: reserve.config.liquidityToken.mint,
				decimals: reserve.config.liquidityToken.decimals,
				symbol: symbol,
			};
			let tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));

			tokenB = tokens[Math.floor(Math.random() * tokens.length)];
			tokenB = tokenA;
		}
		done = false;
		if (process.env.tradingStrategy === "pingpong") {
			await pingpongStrategy(jupiter, tokenA, tokenB, market, reserve, prices);
		}
		if (process.env.tradingStrategy === "arbitrage") {
			await pingpongStrategy(jupiter, tokenA, tokenB, market, reserve, prices);
			//await arbitrageStrategy(jupiter, tokenA, tokenB);
		}
	}
};
let baddies = [];
let goodies = [];
const run = async () => {
	try {
		// set everything up
		let { jupiter, tokenA, tokenB, market } = await setup();

		if (false) {
			//process.env.tradingStrategy === "pingpong") {
			// set initial & current & last balance for tokenA
			cache.initialBalance.tokenA = toNumber(
				cache.config.tradeSize.value,
				reserve.config.liquidityToken.decimals
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
				reserve.config.liquidityToken.decimals
			);
			cache.currentBalance.tokenA = cache.initialBalance.tokenA;
			cache.lastBalance.tokenA = cache.initialBalance.tokenA;
		}

		// 2. Read on-chain accounts for reserve data and cache
		await market.loadReserves();
		market.refreshAll();
		market.reserves = market.reserves.filter(
			(reserve) => reserve.stats.totalLiquidityWads / WAD > 0
		);
		if (market.reserves.length == 0) return;

		global.botInterval = setInterval(async function () {
			market.refreshAll();
			watcher(jupiter, tokenA, tokenA, market);
		}, cache.config.minInterval);
	} catch (error) {
		console.log(error);
		process.exitCode = 1;
	}
};
run();
