import { AddressLookupTableProgram, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import fs from 'fs'
// @ts-ignore
const SIGNER_WALLET =  Keypair.fromSecretKey(
    // @ts-ignore
	JSON.parse(fs.readFileSync('/Users/jarettdunn/notjaregm.json').toString())//(process.env.SOLANA_WALLET_PRIVATE_KEY)
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

let LOOKUP_TABLE_ADDRESS = new PublicKey("9kfsqRaTP2Zs6jXxtVa1ySiwVYviKxvrDXNavxDxsfNC")


    let hmms = ["JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB","AGGZ2djPDEvrbgiBTV3P8UoB8Zf1kGawkWd2eu553o44"
    , "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    , "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
    , "SysvarC1ock11111111111111111111111111111111", "11111111111111111111111111111111",
    , '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin', '6MLxLqiXaaSUpkgMnWDTuejNZEz3kE7k2woyHGVFw319',
     'EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S', 'CTMAxxk34HjKWxQ3QLZK1HpaLXmBveao3ESePXbiyfzh','AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6',
      "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP", 'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ', '2KehYt3KsEQR53jYcxjbQp2d2kCp4AkuQW68atufRwSr',
      'MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky', 'SCHAtsf8mbjyjiv4LkhLKutTf6JnZAbdJKFkXQNMFHZ','SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr',
      'SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1','PSwapMdSai8tjrEXcxFeQth87xC4rRsa4VA5mhGhXkP','cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8',
      'Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j','MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD','7WduLbRfYhTJktjLw5FDEyrqoEv61aTTCuGAetgLjzN5'
    , "3qgS5KYBTFJ6Lt8GujDEQLcgfLPSnFZ5VFMrxoes7rXs",  '5EUiihMbweSuBAFgU5KR7X1x8TJapNRaf9AyAXk73vC8','HXgqkq5hn6QxrtJmtPW7igf7G4mrxbqS5c8NQybnxYi2',
    'BLBYiq48WcLQ5SxiftyKmPtmsZPUBEnDEjqEnKGAR4zx'
    ,'3hsU1VgsBgBgz5jWiqdw9RfGU6TpWdCmdah1oi4kF3Tq','DyDdJM9KVsvosfXbcHDp4pRpmbMHkRq3pcarBykPy4ir','DBsMwKfeoUHhxMi9x6wd2AsT12UwUCssjNbUzu1aKgqj',
    '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC','mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So','UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q','7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE','EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL','Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN','3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM','8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ']
    let keys: any = []
for (var ix of hmms){
    keys.push(new PublicKey(ix as string))
    
}
console.log(keys)
const addAddressesInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: SIGNER_WALLET.publicKey,
    authority: SIGNER_WALLET.publicKey,
    lookupTable: LOOKUP_TABLE_ADDRESS,
    addresses: keys,
});
// Step 2 - Generate a transaction and send it to the network
   await createAndSendV0Tx([addAddressesInstruction]);
  console.log(`Lookup Table Entries: `,`https://explorer.solana.com/address/${LOOKUP_TABLE_ADDRESS.toString()}/entries?cluster=devnet`)

            /*

        const addAddressesInstruction = AddressLookupTableProgram.extendLookupTable({
            payer: SIGNER_WALLET.publicKey,
            authority: SIGNER_WALLET.publicKey,
            lookupTable: LOOKUP_TABLE_ADDRESS,
            addresses: keys,
        });*/
        // Step 2 - Generate a transaction and send it to the network
     //   await createAndSendV0Tx([addAddressesInstruction]);
      //  console.log(`Lookup Table Entries: `,`https://explorer.solana.com/address/${LOOKUP_TABLE_ADDRESS.toString()}/entries?cluster=devnet`)
    

})
