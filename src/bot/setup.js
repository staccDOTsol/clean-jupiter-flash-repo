const fs = require("fs");
const bs58 = require("bs58");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const BN = require("bn.js");
const { Prism } = require("@prism-hq/prism-ag");

const { loadConfigFile } = require("../utils");
const cache = require("./cache");
const JSBI = require("jsbi");
var { SolendMarket } = require("../../solend-sdk");
if (process.env.tradingStrategy == "arbitrage") {
	var { SolendMarket } = require("../../solend-sdk/save/classes/market");
}
const setup = async () => {
	let spinner, tokens, tokenA, tokenB, wallet;
	try {
		// listen for hotkeys
		//listenHotkeys();

		// load config file and store it in cache
		cache.config = loadConfigFile({ showSpinner: false });

		// read tokens.json file
		try {
			tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
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

		// check wallet private key
		try {
			if (
				!process.env.SOLANA_WALLET_PRIVATE_KEY ||
				(process.env.SOLANA_WALLET_PUBLIC_KEY &&
					process.env.SOLANA_WALLET_PUBLIC_KEY?.length !== 88)
			) {
				throw new Error("Wallet check failed!");
			} else {
				wallet = Keypair.fromSecretKey(
					bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
				);
			}
		} catch (error) {
			throw error;
		}

		// connect to RPC
		const connection = new Connection(
			process.env.ALT_RPC_LIST.split(",")[
				Math.floor(Math.random() * process.env.ALT_RPC_LIST.split(",").length)
			]
		);

		let prism = await Prism.init({
			user: wallet,
			connection: connection,
			tokenList: JSON.parse(fs.readFileSync("./solana.tokenlist.json")),
			slippage: 8000,
			host: {
				// optional
				// host platform fee account publickey base58
				publicKey: "EDfPVAZmGLq1XhKgjpTby1byXMS2HcRqRf5j7zuQYcUg",
				// fee bps e.g 5 => 0.05%
				fee: 138,
			},
		});
		cache.isSetupDone = true;

		// find tokens full Object
		tokenA = tokens.find((t) => t.address === cache.config.tokenA.address);
		tokenB = tokenB; //tokens.find((t) => t.address === cache.config.tokenB.address);
		tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
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
			process.env.tradingStrategy == "pingpong"
				? process.env.marketKey
				: new PublicKey(config.address) // optional m address (TURBO SOL). Defaults to 'Main' market
		);
		return { prism, tokenA, tokenA, market };
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
