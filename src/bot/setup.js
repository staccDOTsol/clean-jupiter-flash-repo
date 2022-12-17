const fs = require("fs");
const BN = require("bn.js");

const WAD = new BN("1".concat(Array(18 + 1).join("0")));

const bs58 = require("bs58");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { Jupiter, getPlatformFeeAccounts } = require("@jup-ag/core");
const { Prism } = require("@prism-hq/prism-ag");
const fetch = require("node-fetch");
const { loadConfigFile } = require("../utils");
const cache = require("./cache");
const JSBI = require("jsbi");
var { SolendMarket } = require("@solendprotocol/solend-sdk");
if (true) {
	var { SolendMarket } = require("../../solend-sdk/save/classes/market");
}
const setup = async () => {
	let spinner, tokens, tokenA, tokenB, wallet;
	try {
		// listen for hotkeys
		//listenHotkeys();

		// load config file and store it in cache
		cache.config = loadConfigFile({ showSpinner: false });
		let tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
		// read tokens.json file
		try {
			
			// find tokens full Object

			tokenA = tokens.find((t) => t.address === cache.config.tokenA.address);
			tokenB = tokens.find((t) => t.address === cache.config.tokenB.address);
			configs = JSON.parse(
				fs
					.readFileSync(
						process.env.tradingStrategy === "pingpong"
							? "./configs.json"
							: "./configs2.json"
					)
					.toString()
			);
		} catch (error) {
			throw error;
		}

		// connect to RPC
		const connection = new Connection(
			process.env.ALT_RPC_LIST.split(",")[
				Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
			]
		);
		// find tokens full Object
		tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));

		console.log(tokens.length);
		tokenA = tokens.find((t) => t.address === cache.config.tokenA.address);
		tokenB = tokens.find((t) => t.address === cache.config.tokenB.address);
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

		configs = configs.filter(
			(c) => !c.isHidden && !c.isPermissionless && c.reserves.length > 4
		);

		let config = configs[Math.floor(Math.random() * configs.length)];
		let market = await SolendMarket.initialize(
			connection,
			"production", // optional environment argument
			/*process.env.tradingStrategy == "pingpong"
				? process.env.marketKey
				: */ new PublicKey(config.address) // optional m address (TURBO SOL). Defaults to 'Main' market
		);

		// 2. Read on-chain accounts for reserve data and cache
		await market.loadReserves();
		market.refreshAll();

			
		let aran = 10//ß Math.floor(Math.random() * market.reserves.length);
		if (aran == 0) return;
		res = market.reserves[aran];
		reserve = res; //market.reserves[Math.floor(Math.random()* market.reserves.length)]
		let symbol = reserve.config.asset;

		tokenA = {
			address: reserve.config.liquidityToken.mint,
			decimals: reserve.config.liquidityToken.decimals,
			symbol: symbol,
		};
		//	tokenB = tokens[Math.floor(Math.random() * tokens.length)];
		tokenB = tokenA;

let keys = [process.env.one,
	process.env.two,
	process.env.three,
	process.env.four,
	process.env.five,
	process.env.six,
	process.env.seven,
	process.env.eight,
	process.env.nine,
	process.env.ten,
	process.env.eleven,
	process.env.twelve,
	process.env.thirteen	
]
		// check wallet private key
		try { 
				wallet = Keypair.fromSecretKey(
					bs58.decode(keys[aran-1])
				);
		} catch (error) {
			throw error;
		}

		const prism = await Prism.init({
			user: wallet,
			slippage: 99,
			connection: connection,
		});

		console.log(1)
		const platformFeeAndAccounts = {
			feeBps: 50,
			feeAccounts: await getPlatformFeeAccounts(
				connection,
				wallet.publicKey // The platform fee account owner
			), // map of mint to token account pubkey
		};
		console.log(2)
		const jupiter = await Jupiter.load({
			connection,
			platformFeeAndAccounts,
			cluster: cache.config.network,
			user: wallet,
			restrictIntermediateTokens: false,
			wrapUnwrapSOL: false,
		});
		console.log(3)
		cache.isSetupDone = true;
		return { jupiter, prism, tokenA, tokenA, market, wallet };
	} catch (error) {
		console.log(error);
		process.exitCode = 1;
	}
};

const getInitialOutAmountWithSlippage = async (
	prism,
	inputToken,
	outputToken,
	amountToTrade
) => {
	let spinner;
};

module.exports = {
	setup,
	getInitialOutAmountWithSlippage,
};
