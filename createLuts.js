import bs58 from 'bs58'
import { AddressLookupTableProgram, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { SolendMarket } from '@solendprotocol/solend-sdk';
import fs from 'fs'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
// @ts-ignore
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { ComputeBudgetProgram } from '@solana/web3.js';
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
let luts = ["2gDBWtTf2Mc9AvqxZiActcDxASaVqBdirtM3BgCZduLi"
]


let units = 366642
let tinsts: any = []
const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({ 
    //234907
    units: units 
  });
  
  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ 
    microLamports: Math.floor(units / 1000000 * 50)
  });
  
  tinsts.push(modifyComputeUnits)
  tinsts.push(addPriorityFee)
  

    let ata2 = new Keypair();
    tinsts.push(
        await createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            new PublicKey("C98A4nkJXhpVZNAZdHUA95RpTF3T4whtQubL3YobiUX9"), // mint
            ata2.publicKey, // ata
            new PublicKey("5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx"), // owner
            SIGNER_WALLET.publicKey, // payer
        )
    )
    console.log(...tinsts)
    
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
