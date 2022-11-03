const fs = require("fs");
const bs58 = require("bs58");
const { Jupiter } = require("@jup-ag/core");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");

const { loadConfigFile } = require("../utils");
const cache = require("./cache");
const JSBI  = require("jsbi");

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
		const connection = new Connection(process.env.ALT_RPC_LIST.split(',')[Math.floor(Math.random()*process.env.ALT_RPC_LIST.split(',').length)]);


		const jupiter = await Jupiter.load({
			connection,
			cluster: cache.config.network,
			user: wallet,
			restrictIntermediateTokens: false,
			wrapUnwrapSOL: cache.wrapUnwrapSOL,
		});

		cache.isSetupDone = true;
	tokens = JSON.parse(fs.readFileSync("./temp/tokens.json"));
			// find tokens full Object
			tokenA = tokens.find((t) => t.address === cache.config.tokenA.address);
	tokenB = tokens.find((t) => t.address === cache.config.tokenB.address);
		
		return { jupiter, tokenA, tokenB };
	} catch (error) {

		console.log(error)
		process.exitCode = 1;
	}
};

const getInitialOutAmountWithSlippage = async (
	jupiter,
	inputToken,
	outputToken,
	amountToTrade
) => {
	let spinner;
	try {
		// compute routes for the first time
		const routes = await jupiter.computeRoutes({
			inputMint: new PublicKey(inputToken.address),
			outputMint: new PublicKey(outputToken.address),
			            amount: JSBI.BigInt(amountToTrade), // raw input amount of tokens
            slippageBps: 0,

			forceFetch: true,
		});


		return routes.routesInfos[0].outAmountWithSlippage;
	} catch (error) {

		console.log(error)
		process.exitCode = 1;
	}
};

module.exports = {
	setup,
	getInitialOutAmountWithSlippage,
};
