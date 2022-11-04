import bs58 from 'bs58'
import { AddressLookupTableProgram, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { SolendMarket } from '@solendprotocol/solend-sdk';
import fs from 'fs'
// @ts-ignore
const SIGNER_WALLET =  Keypair.fromSecretKey(
    // @ts-ignore
	bs58.decode(process.env.SOLANA_WALLET_PRIVATE_KEY)
);
//const LOOKUP_TABLE_ADDRESS = new PublicKey(""); // We will add this later

// @ts-ignore
const connection = new Connection("https://api.mainnet-beta.solana.com")
async function createAndSendV0Tx(txInstructions: TransactionInstruction[]) {
    // Step 1 - Fetch Latest Blockhash
    let latestBlockhash = await connection.getLatestBlockhash('finalized');
    console.log("   ✅ - Fetched latest blockhash. Last valid height:", latestBlockhash.lastValidBlockHeight);

    // Step 2 - Generate Transaction Message
    const messageV0 = new TransactionMessage({
        payerKey: SIGNER_WALLET.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: txInstructions
    }).compileToV0Message();
    console.log("   ✅ - Compiled transaction message");
    const transaction = new VersionedTransaction(messageV0);

    // Step 3 - Sign your transaction with the required `Signers`
    transaction.sign([SIGNER_WALLET]);
    console.log("   ✅ - Transaction Signed");

    // Step 4 - Send our v0 transaction to the cluster
    // @ts-ignore
    const txid = await sendAndConfirmTransaction(connection, transaction, { maxRetries: 5 });
    console.log("   ✅ - Transaction sent to network");

    // Step 5 - Confirm Transaction 
    const confirmation = await connection.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    if (confirmation.value.err) { throw new Error("   ❌ - Transaction not confirmed.") }
  
    console.log('🎉 Transaction succesfully confirmed!', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}
setTimeout(async function(){        // Step 1 - Create Transaction Instruction
    let    configs = JSON.parse(fs.readFileSync("configs.json").toString())
    let addies: any = []
let add: any = []
let abc = 0 
let which = -1
let luts = ["BYCAUgBHwZaVXZsbH7ePZro9YVFKChLE8Q6z4bUvkF1f",
"5taqdZKrVg4UM2wT6p2DGVY1uFnsV6fce3auQvcxMCya",
"2V7kVs1TsZv7j38UTv4Dgbc6h258KS8eo5GZL9yhxCjv",
"9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC"
]
        for (var m of configs.reverse()){
        let    aaa = await SolendMarket.initialize(
               connection,
               "production", // optional environment argument
          // @ts-ignore
               new PublicKey(m.address) // optional m address (TURBO SOL). Defaults to 'Main' market
             );
             // 2. Read on-chain accounts for reserve data and cache
             await aaa.loadReserves();
             for (var r of aaa.reserves){
                for(var v of Object.values(r))
          if (abc > 220){
            abc = 0
            which++
let lookupTableAddress = new PublicKey(luts[which])
            console.log("Lookup Table Address:", lookupTableAddress.toBase58());

for (var gr = 0; gr <= 220 / 20; gr++){
    
    let tadds =  []
    for (var ad in addies){
        let a = parseInt(ad)
        if (a >= gr * 20 && a <= gr * 20 + 20){
        // @ts-ignore
    tadds.push(addies[ad])    
    
    }
}
let addAddressesInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: SIGNER_WALLET.publicKey,
    authority: SIGNER_WALLET.publicKey,
    lookupTable: lookupTableAddress,
    addresses: tadds,
});
// Step 2 - Generate a transaction and send it to the network
try {
  await createAndSendV0Tx([addAddressesInstruction]);
} catch (err){
    console.log(err)
}
}
  addies = [] 
add = []
          }
                {
                    try {
            // @ts-ignore
                        if (!add.includes(v)){
                            // @ts-ignore
                            add.push(v)
                        // @ts-ignore
addies.push(new PublicKey(v))
abc++            
}
                }
                    catch(err){}
                }
                // @ts-ignore
                for(var v of Object.values(r.config))
                {
                    try {
                        // @ts-ignore
                        if (!add.includes(v)){
                            
            // @ts-ignore
            add.push(v)
                        // @ts-ignore
addies.push(new PublicKey(v))
     abc++               }
                    }
                    catch(err){}
                }

            }
            
            }
            /*

        const addAddressesInstruction = AddressLookupTableProgram.extendLookupTable({
            payer: SIGNER_WALLET.publicKey,
            authority: SIGNER_WALLET.publicKey,
            lookupTable: LOOKUP_TABLE_ADDRESS,
            addresses: [
                Keypair.generate().publicKey,
                Keypair.generate().publicKey,
                Keypair.generate().publicKey,
                Keypair.generate().publicKey,
                Keypair.generate().publicKey
            ],
        });*/
        // Step 2 - Generate a transaction and send it to the network
     //   await createAndSendV0Tx([addAddressesInstruction]);
      //  console.log(`Lookup Table Entries: `,`https://explorer.solana.com/address/${LOOKUP_TABLE_ADDRESS.toString()}/entries?cluster=devnet`)
    

})
