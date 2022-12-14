require("dotenv").config();
const bs58 = require("bs58");
const { loadConfigFile } = require("../utils");
const fs = require("fs");
const BN = require("bn.js");
const { TOKEN_LIST_URL } = require("@jup-ag/core");

const fetch = require("node-fetch");
const { PublicKey, Keypair } = require("@solana/web3.js");
const JSBI = require("jsbi");
const WAD = new BN("1".concat(Array(18 + 1).join("0")));

const {
	calculateProfit,
	toNumber,
	updateIterationsPerMin,
} = require("../utils");
const cache = require("./cache");
const { setup } = require("./setup");
const { swap, failedSwapHandler, successSwapHandler } = require("./swap");
const { Connection } = require("@solana/web3.js");
const { config } = require("process");
let mod = 100;
let payer = Keypair.fromSecretKey(
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);
process.on("uncaughtException", (err) => {
	console.log(err);
});
process.on("unhandledRejection", (reason, promise) => {
	console.log(reason);
});
const pingpongStrategy = async (
	jupiter,
	prism,
	tokenA,
	tokenB
) => {
	cache.iteration++;
	const date = new Date();
	const i = cache.iteration;
	cache.queue[i] = -1;
	try {
		cache.config = loadConfigFile({ showSpinner: false });
		let minprofit = process.env.minPercProfit

		// calculate & update iterations per minute
		updateIterationsPerMin(cache);
		//tokenB = tokenA
		// Calculate amount that will be used for trade
		var amountToTrade = 0
		const connection = new Connection(
			process.env.ALT_RPC_LIST.split(",")[
				Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
			]
		);
				const pubkey =  ( await connection.getParsedTokenAccountsByOwner(payer.publicKey, 
		{mint: new PublicKey((tokenA.address))})).value
		let amount = 0 
		for (var pk of pubkey){
		  if (parseFloat(pk.account.data.parsed.info.tokenAmount.uiAmount ) > amount){
			amount =parseInt( pk.account.data.parsed.info.tokenAmount.amount) 
		  }
		}
		amountToTrade = Math.floor(amount * (mod / 100))
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
		//tokenB = tokens[Math.floor(Math.random() * tokens.length)];
		//console.log(tokenB)
		//tokenB = tokens.find((t) => t.address === tokenB);

		// set input / output token
		const inputToken = tokenA; //cache.sideBuy ? tokenA : tokenB;
		const outputToken = tokenB; //cache.sideSell ? tokenB : tokenA;
		//console.log(inputToken.symbol);
		// check current routes
		if (!outputToken) return;
		const performanceOfRouteCompStart = performance.now();
		var routes, route;
		if (process.env.tradingStrategy == "arbitrage") {
			routes = await jupiter.computeRoutes({
				inputMint: new PublicKey(inputToken.address),
				outputMint: new PublicKey(outputToken.address),
				amount: amountToTrade,
				slippageBps: 5000,
				forceFetch: true,
			});
			route = await routes.routesInfos[Math.floor(Math.random() * 2)];
		//	console.log(route.outAmount)
		} else {
			//	console.log(1)
			await prism.loadRoutes(tokenA.address, tokenB.address);

			//	console.log(2)
			routes = prism.getRoutes(amountToTrade / 10 ** tokenA.decimals);
			route = routes[Math.floor(Math.random() * 1)];
		//	console.log(route.amountOut)
		}
		let route2, routes2
		if (!route) return
		/*
		if (process.env.tradingStrategy == "arbitrage") {
			routes2 = await jupiter.computeRoutes({
				outputMint: new PublicKey(inputToken.address),
				inputMint: new PublicKey(outputToken.address),
				amount: JSBI.toNumber(route.outAmount) ,
				slippageBps: 50,
				forceFetch: true,
			});
			route2 = await routes2.routesInfos[Math.floor(Math.random() * 2)];
		} else {
			//	console.log(1)
			await prism.loadRoutes(tokenB.address, tokenA.address);

			//	console.log(2)
			routes2 = prism.getRoutes(route.amountOut);
			route2 = routes2[Math.floor(Math.random() * 1)];
		}
		*/
		//if (!checkRoutesResponse(routes)) return;

		// count available routes
		//cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
		//	routes.routesInfos.length;

		// update status as OK
		cache.queue[i] = 0;

		if (!route) return;
		let ammIds = [];
		try {
			ammIds = JSON.parse(fs.readFileSync("./ammIds.json").toString());
		} catch (err) {}
		let goodluts = [];

		try {
		} catch (err) {}
		try {
			let ammIds = [];
			try {
				ammIds = JSON.parse(fs.readFileSync("./ammIds.json").toString());
			} catch (err) {}
			for (var mi of route.marketInfos) {
				if (!ammIds.includes(mi.amm.id)) ammIds.push(mi.amm.id);
			}
			fs.writeFileSync("./ammIds.json", JSON.stringify(ammIds));
		} catch (Err) {
			//console.log(Err);
		}

		//	const routes2 = prism.getRoutes(route.outAmount * 1.0002)

		// choose first route
		//const route2 = routes2[Math.floor(Math.random() * 1)];
		//if (!route2) return
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
		} /*
		let routes2;
		if (!checkRoutesResponse(routes)) return;

		try {
			await prism.loadRoutes(tokenB.address, tokenA.address);
			routes2 = prism.getRoutes(
				process.env.tradingStrategy == 'arbitrage' ? 	JSBI.toNumber(route.outAmount) : (route.amountOut) / 10 ** tokenB.decimals
			);
		} catch (err) {
			return;
		}
		// count available routes
		cache.availableRoutes[cache.sideBuy ? "buy" : "sell"] =
			routes.routesInfos.length;

		// update status as OK
		cache.queue[i] = 0;
		// choose first route

		// choose first route

		const route2 = routes2[Math.floor(Math.random() * 2)]; //await routes.find((r) => r.providers.length  <= 15)
		*/
		if (!route) return;
	//	if (!route2) return;

		ammIds = [];
		try {
			ammIds = JSON.parse(fs.readFileSync("./ammIds.json").toString());
		} catch (err) {}
		goodluts = [];

		try {
		} catch (err) {}
		try {
			let ammIds = [];
			try {
				ammIds = JSON.parse(fs.readFileSync("./ammIds.json").toString());
			} catch (err) {}
			for (var mi of route.marketInfos) {
				if (!ammIds.includes(mi.amm.id)) ammIds.push(mi.amm.id);
			}
			for (var file of [...routes]) {
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

			fs.writeFileSync("./ammIds.json", JSON.stringify(ammIds));
		} catch (Err) {
			//console.log(Err);
		}
			 route2 = route
		let simulatedProfit;
		try {
			simulatedProfit = calculateProfit(
				process.env.tradingStrategy == "arbitrage"
					? JSBI.toNumber(route.inAmount)
					: route.amountIn,
				process.env.tradingStrategy == "arbitrage"
					? JSBI.toNumber(route2.outAmount)
					: route2.amountOut
			);
		} catch (err) {
			try {
				simulatedProfit = calculateProfit(
					process.env.tradingStrategy == "arbitrage"
						? route.inAmount
						: route.amountIn / 10 ** tokenA.decimals,
					process.env.tradingStrategy == "arbitrage"
						? JSBI.toNumber(route.outAmount)
						: route.amountOut / 10 ** tokenA.decimals
				);
			} catch (err) {
				try {
					simulatedProfit = calculateProfit(
						process.env.tradingStrategy == "arbitrage"
							? JSBI.toNumber(route.inAmount)
							: route.amountIn / 10 ** tokenA.decimals,
						process.env.tradingStrategy == "arbitrage"
							? route.outAmount
							: route.amountOut / 10 ** tokenA.decimals
					);
				} catch (err) {
					try {
						simulatedProfit = calculateProfit(
							process.env.tradingStrategy == "arbitrage"
								? route.inAmount
								: route.amountIn / 10 ** tokenA.decimals,
							process.env.tradingStrategy == "arbitrage"
								? route.outAmount
								: route.amountOut / 10 ** tokenA.decimals
						);
					} catch (err) {}
				}
			}
		}
		console.log(simulatedProfit)
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
		if (simulatedProfit >= parseFloat(minprofit)) {
			// hotkeys

			if (cache.tradingEnabled || cache.hotkeys.r) {
				// store trade to the history
				const [tx, performanceOfTx] = await swap(
					jupiter,
					prism,
					route,
					route2, //route2,
					tokenA,
					amountToTrade
				);

				// stop refreshing status
				//clearInterval(printTxStatus);
				if (tx != 0) {
					mod = mod * 4;
					if (mod > 100){
						mod = 100
					}
					//successSwapHandler(tx, tradeEntry, tokenA, tokenB);
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
		if (tx == 0) {
			cache.swappingRightNow = false;
		}
		if (mod > 0.000001) {
			if (simulatedProfit > 0) {
				mod = mod * 1.1;
			} else {
				mod = mod / 1.3;
			}
		} else {
			mod = 100 ;

			
		}
		cache.swappingRightNow = false;
		//console.log("mod: " + mod.toString());
	} catch (error) {
		cache.queue[i] = 1;
		console.log(error);
	} finally {
		delete cache.queue[i];
	}
};

const watcher = async (jupiter, prism) => {
	if (true) {
		let done = false;

		let prices = {};
		done = false;
		
		let tokenA = {
			address: process.env.trade,
			decimals: process.env.decimals,
			symbol: process.env.symbol,
		};
		let tokenB = tokenA;
		done = false;
		
			await pingpongStrategy(
				jupiter,
				prism,
				tokenA,
				tokenB,
				prices
			);
		
	}
};
let baddies = [];
let goodies = [];
const run = async () => {
	try {
		// set everything up
		let { jupiter, prism, tokenA, tokenB } = await setup();

		// 2. Read on-chain accounts for reserve data and cache

		let topTokens = await (
			await fetch("https://cache.jup.ag/top-tokens")
		) //TOKEN_LIST_URL['mainnet-beta'])
			.json();
		
		global.botInterval = setInterval(async function () {
			await watcher(jupiter, prism, tokenA, tokenB);
		}, 500);
	} catch (error) {
		console.log(error);
		process.exitCode = 1;
	}
};
run();
