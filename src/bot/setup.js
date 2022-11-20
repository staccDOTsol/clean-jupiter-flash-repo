const fs = require("fs");
const bs58 = require("bs58");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const BN = require("bn.js");
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
		const prism = await Prism.init({
			user: wallet,
			slippage: 99,
			connection: connection,
		});

		const platformFeeAndAccounts = {
			feeBps: 50,
			feeAccounts: await getPlatformFeeAccounts(
				connection,
				wallet.publicKey // The platform fee account owner
			), // map of mint to token account pubkey
		};
		const jupiter = await Jupiter.load({
			connection,
			platformFeeAndAccounts,
			cluster: cache.config.network,
			user: wallet,
			restrictIntermediateTokens: Math.random() < 0.5 ? true : false,
			wrapUnwrapSOL: false,
		});
		cache.isSetupDone = true;

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
		return { jupiter, prism, tokenA, tokenA, market };
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
