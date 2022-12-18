# prism-sdk

Initialization
```typescript
import { Prism } from "@prism-hq/prism-ag";

let prism = await Prism.init({
    // user executing swap
    user: PublicKey | Keypair | Wallet,               // optional (if you don't provide upon init, then you'll need to call prism.setSigner() after user connects the wallet)
    host: {                                           // optional
      // host platform fee account publickey base58
      publicKey: string,
      // fee bps e.g 5 => 0.05%
      fee: number,
    },
    // rpc connection
    connection: Connection,                           // optional
    // slippage
    slippage: number,                                 // optional
    // same format as solanaTokenList.json
    tokenList: {tokens:Array<any>}                    // optional
});
```
Executing swap
```typescript
await prism.loadRoutes("USDC", "PRISM");         // load routes for tokens, tokenSymbol | tokenMint (base58 string)
let routes = prism.getRoutes(10);                // get routes based on from Token amount 10 USDC -> ? PRISM
let result = await prism.swap(routes[0]);        // execute swap (sign, send and confirm transaction)
```
Settings
```typescript
// setSigner KeyPair | Wallet before executing swap if not provided upon initialization
await prism.setSigner(KeyPair|Wallet);

// change slippage 1 = 1%
prism.setSlippage(1);
```
Tools
```typescript
// get user token accounts
prism.getUserAccounts();

// unwrap all wSOL accounts for user
let txIds = await prism.unwrapWSolAccounts();

// get user OpenOrders accounts
let openOrdersSerum: Array<any> = prism.getUserOpenOrdersSerum();
let openOrdersOpenBook: Array<any> = prism.getUserOpenOrdersOpenBook();

let openOrdersToClose = [
  ...openOrdersSerum.slice(2, 4), 
  ...openOrdersOpenBook.slice(0, 2),
];
// close user OpenOrders accounts and claim SOL paid for rent exemption 
let txIds = await prism.closeOpenOrders(openOrdersToClose);
```
Stats
```typescript
// load user trade history (swaps made using prism aggregator) without init (Static function)
let userTradeHistory = await Prism.loadUserTradeHistory(PublicKey);
// load user trade history (if prism is initialized with a wallet)
let userTradeHistory = await prism.loadUserTradeHistory();

// load prism global stats (use as static or on Prism Object)
let prismStats = await Prism.loadPrismStats();
let prismStats = await prism.loadPrismStats();
```
