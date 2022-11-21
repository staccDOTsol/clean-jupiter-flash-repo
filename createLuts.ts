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
	bs58.decode(process.env.WALLIE as string)
);
//const LOOKUP_TABLE_ADDRESS = new PublicKey(""); // We will add this later

// @ts-ignore
const connection = new Connection("https://solana--mainnet.datahub.figment.io/apikey/fff8d9138bc9e233a2c1a5d4f777e6ad", "singleGossip")
async function createAndSendV0Tx(txInstructions: TransactionInstruction[]) {
    // Step 1 - Fetch Latest Blockhash
    let latestBlockhash = await connection.getLatestBlockhash();
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
    const txid = await connection.sendTransaction(transaction, { skipPreflight: false, maxRetries: 5 }, { skipPreflight: false, maxRetries: 5 });
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
    return lookupTableAddress
}
setTimeout(async function(){        // Step 1 - Create Transaction Instruction
let atas = ["So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo","5kqGoFPBGoYpFcxpa6BFRp3zfNormf52KCo5vQ8Qn5bx","GoUPK9AX5yuxSMdovRZetzrzLVAuep7P9axWc9jyb7LC","JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph","JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB","E4AifNCQZzPjE1pTjAWS8ii4ovLNruSGsdWRMBSq2wBa","JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo","JUP6i4ozu5ydDCnLiMogSckDPpbtr7BJ4FtzYWkb5Rk","GokivDYuQXPZCWRkwMhdH2h91KpDQXBEmpgBgs55bnpH","AddressLookupTab1e1111111111111111111111111","metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s","vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn","auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8","p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98","TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk","grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef","cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ","namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX","mgr99QFMYByTqGPWmNqunV7vBLmWWXdSrHUfV8Jf3JM","pcaBwhJ1YHp7UDA7HASpQsRUmUNwzgYaLQto2kSj1fR","tmeEDp1RgoDtZFtx6qod3HkbQmv9LMe36uqKVvsLTDE","useZ65tbyvWpdYCLDJaegGK34Lnsi8S3jZdwx8122qp","LocktDzaV1W2Bm9DeZeiyz4J9zs4fRqNiYqQyracRXw","Govz1VyoyLD5BL6CSCxUJLVLsQHRwjfFj1prNsdNg5Jw","GokivDYuQXPZCWRkwMhdH2h91KpDQXBEmpgBgs55bnpH","AGGZ2djPDEvrbgiBTV3P8UoB8Zf1kGawkWd2eu553o44", "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","SysvarC1ock11111111111111111111111111111111", "11111111111111111111111111111111", "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8", "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin","6MLxLqiXaaSUpkgMnWDTuejNZEz3kE7k2woyHGVFw319", "EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S","CTMAxxk34HjKWxQ3QLZK1HpaLXmBveao3ESePXbiyfzh", "AMM55ShdkoGRB5jVYPjWziwk8m5MpwyDgsMWHaMSQWH6", "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP","SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ","2KehYt3KsEQR53jYcxjbQp2d2kCp4AkuQW68atufRwSr","MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky", "SCHAtsf8mbjyjiv4LkhLKutTf6JnZAbdJKFkXQNMFHZ", "SSwapUtytfBdBn1b9NUGG6foMVPtcWgpRU32HToDUZr","SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1", "PSwapMdSai8tjrEXcxFeQth87xC4rRsa4VA5mhGhXkP","cysPXAjehMpVKUapzbMCCnpFxUFFryEWEaLgnb9NrR8","Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j","MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD","7WduLbRfYhTJktjLw5FDEyrqoEv61aTTCuGAetgLjzN5", "3qgS5KYBTFJ6Lt8GujDEQLcgfLPSnFZ5VFMrxoes7rXs", "5EUiihMbweSuBAFgU5KR7X1x8TJapNRaf9AyAXk73vC8","HXgqkq5hn6QxrtJmtPW7igf7G4mrxbqS5c8NQybnxYi2", "BLBYiq48WcLQ5SxiftyKmPtmsZPUBEnDEjqEnKGAR4zx","3hsU1VgsBgBgz5jWiqdw9RfGU6TpWdCmdah1oi4kF3Tq", "DyDdJM9KVsvosfXbcHDp4pRpmbMHkRq3pcarBykPy4ir", "DBsMwKfeoUHhxMi9x6wd2AsT12UwUCssjNbUzu1aKgqj", "8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC","mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So","UefNb6z6yvArqe4cJHTXCqStRsKmWhGxnZzuHbikP5Q","7GgPYjS5Dza89wV6FpZ23kUJRG5vbQ1GM25ezspYFSoE", "EyaSjUtSgo9aRD1f8LWXwdvkpDTmXAW54yoSHZRF14WL", "Du3Ysj1wKbxPKkuPPnvzQLQh8oMSVifs3jGZjJWXFmHN","3JLPCS1qM2zRw3Dp6V4hZnYHd4toMNPkNesXdX9tg6KM", "8CxKnuJeoeQXFwiG6XiGY2akBjvJA5k3bE52BfnuEmNQ"]

    let addies: any = []

    for (var ata in atas){
        if (parseInt(ata) <= 230){
            addies.push(new PublicKey(atas[ata]))
        }
    }

    let lut = new PublicKey("BpqokW63562dgpxJfU7WXXtzcDLCQakDJXd3kPojq1X3") //await createLookupTable()

for (var abc = 0; abc <= addies.length / 20; abc++){
let pubkeys: any  = []
let c = 0
for (var add of addies) {
    if (c > 20 * abc && c < 20 * (abc + 1)){
pubkeys.push((add))
    }
    c++
}
console.log(pubkeys.length)



    
            

        const addAddressesInstruction = AddressLookupTableProgram.extendLookupTable({
            payer: SIGNER_WALLET.publicKey,
            authority: SIGNER_WALLET.publicKey,
            lookupTable: lut,
            addresses: pubkeys,
        });
        // Step 2 - Generate a transaction and send it to the network
       await createAndSendV0Tx([addAddressesInstruction]);
    }
      //  console.log(`Lookup Table Entries: `,`https://explorer.solana.com/address/${LOOKUP_TABLE_ADDRESS.toString()}/entries?cluster=devnet`)
    

})