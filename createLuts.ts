import { AddressLookupTableProgram, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import fs from 'fs'
const SIGNER_WALLET = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.SOLANA_PRIVATE_KEY as string).toString()));
//const LOOKUP_TABLE_ADDRESS = new PublicKey(""); // We will add this later

// @ts-ignore
const connection = new Connection(process.env.ALT_RPC_LIST.split(',')[Math.floor(Math.random()*process.env.ALT_RPC_LIST.split(',').length)]);
async function createAndSendV0Tx(txInstructions: TransactionInstruction[]) {
    // Step 1 - Fetch Latest Blockhash
    let latestBlockhash = await connection.getLatestBlockhash('finalized');
    console.log("   ✅ - Fetched latest blockhash. Last valid height:", latestBlockhash.lastValidBlockHeight);

    // Step 2 - Generate Transaction Message
  /*  const messageV0 = new TransactionMessage({
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
    const txid = await connection.sendTransaction(transaction, { maxRetries: 5 });
    console.log("   ✅ - Transaction sent to network");

    // Step 5 - Confirm Transaction 
    const confirmation = await connection.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    if (confirmation.value.err) { throw new Error("   ❌ - Transaction not confirmed.") }
  */
//    console.log('🎉 Transaction succesfully confirmed!', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
        // Step 1 - Create Transaction Instruction
    let    configs = JSON.parse(fs.readFileSync("configs.json").toString())

        for (var m of configs.reverse()){
            aaa = await SolendMarket.initialize(
               connection,
               "production", // optional environment argument
               new PublicKey(m.address) // optional m address (TURBO SOL). Defaults to 'Main' market
             );
             // 2. Read on-chain accounts for reserve data and cache
             await aaa.loadReserves();

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
        await createAndSendV0Tx([addAddressesInstruction]);
        console.log(`Lookup Table Entries: `,`https://explorer.solana.com/address/${LOOKUP_TABLE_ADDRESS.toString()}/entries?cluster=devnet`)
    

}

async function createLookupTable() {
    // Step 1 - Get a lookup table address and create lookup table instruction
    const [lookupTableInst, lookupTableAddress] =
        AddressLookupTableProgram.createLookupTable({
            authority: SIGNER_WALLET.publicKey,
            payer: SIGNER_WALLET.publicKey,
            recentSlot: await connection.getSlot(),
        });

    // Step 2 - Log Lookup Table Address
    console.log("Lookup Table Address:", lookupTableAddress.toBase58());

    // Step 3 - Generate a transaction and send it to the network
    createAndSendV0Tx([lookupTableInst]);
}

createLookupTable();