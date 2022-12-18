var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(bodyParser());
app.use(cors());
var reservePairs = {};
app.post("/", async function (req, res) {
  if (req.body.fee > 5000) {
  }
  try {
  } catch (err) {}
  var looking = [];
  var rp = "";
  for (var abc of req.body[0].accountData) {
    if (abc.tokenBalanceChanges.length > 0) {
      if (req.body[0].feePayer == abc.tokenBalanceChanges[0].userAccount) {
        looking.push(
          -1 * parseFloat(abc.tokenBalanceChanges[0].rawTokenAmount.tokenAmount)
        );
        rp += abc.tokenBalanceChanges[0].mint;
      }
    }
  }
  for (var abc of req.body[0].accountData) {
    if (abc.tokenBalanceChanges.length > 0) {
      for (var cba of looking) {
        if (
          cba ==
          parseFloat(abc.tokenBalanceChanges[0].rawTokenAmount.tokenAmount)
        ) {
          if (!Object.keys(reservePairs).includes(rp)) {
            reservePairs[rp] = [];
          }
          console.log(abc.account);
          if (!reservePairs[rp].includes(abc.account)) {
            reservePairs[rp].push(abc.account);
          } else {
            // console.log(rp);
          }
        }
      }
    }
  }
  res.sendStatus(200);
});
const {
  AddressLookupTableProgram,
  Connection,
  GetProgramAccountsConfig,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} = require("@solana/web3.js");
const PromisePool = require("@supercharge/promise-pool").default;
let luts = [];
const fs = require("fs");


let theluts = JSON.parse(fs.readFileSync('./luts.json').toString());
setTimeout(async function () {
  // invalid cache. I will recommend using a paid RPC endpoint.
  let ALT_RPC_LIST = process.env.ALT_RPC_LIST;
  // @ts-ignore
  let ran =
    Math.floor((Math.random() * ALT_RPC_LIST?.split(",").length) / 2) +
    Math.floor((Math.random() * ALT_RPC_LIST?.split(",").length) / 2);
  // @ts-ignore
  var connection = new Connection(ALT_RPC_LIST?.split(",")[ran]);

  const configOrCommitment = {
    commitment: "confirmed",
    filters: [],
  };
  let myluts = {};

  luts = await connection.getProgramAccounts(
    AddressLookupTableProgram.programId
  );
  console.log(luts.length);
});
require("dotenv").config();

try {
  theluts = JSON.parse(fs.readFileSync("./tluts.json").toString());
} catch (err) {
  try {
    theluts = JSON.parse(fs.readFileSync("./luts.json").toString());
  } catch (err) {}
}
async function getLuts() {
  try {
    // invalid cache. I will recommend using a paid RPC endpoint.
    let ALT_RPC_LIST = process.env.ALT_RPC_LIST;
    // @ts-ignore
    await PromisePool.withConcurrency(250)
      .for(luts.reverse())
      // @ts-ignore
      .handleError(async (err, asset) => {
        console.error(`\nError uploading or whatever`, err.message);
        console.log(err);
      })
      // @ts-ignore
      .process(async (lut) => {
        // @ts-ignore
        let ran = Math.floor(Math.random() * ALT_RPC_LIST?.split(",").length);
        // @ts-ignore
        var connection = new Connection(ALT_RPC_LIST?.split(",")[ran]);

        // @ts-ignore
        let maybemine = await connection.getAddressLookupTable(lut.pubkey);

        if (maybemine.value?.state.addresses.length > 138) {
          let templuts = [];
          if (true) {
            // @ts-ignore
            for (var addy of maybemine.value?.state.addresses) {
              let addypk = addy.toBase58();
              let gogos = 0;
              for (var ammIdspks of Object.keys(reservePairs)) {
                for (var pk of reservePairs[ammIdspks]) {
                  try {
                    if (pk === addypk && !Object.keys(theluts).includes(pk)) {
                      //templuts.push(lut.pubkey.toBase58())
                      theluts[pk] = [lut.pubkey.toBase58()];
                      console.log(Object.keys(theluts).length);
                      console.log(pk)
                      fs.writeFileSync("./luts.json", JSON.stringify(theluts));
                      gogos++;
                    } else if (pk === addypk) {
                      //  templuts.push(lut.pubkey.toBase58())

                      if (!theluts[pk].includes(lut.pubkey.toBase58())) {
                        theluts[pk].push(lut.pubkey.toBase58());
                        fs.writeFileSync("./luts.json", JSON.stringify(theluts));
                        gogos++;
                      }
                    }

                    //   fs.writeFileSync('./tluts.json', JSON.stringify(theluts))
                  } catch (err) {}
                }
              }
            }
          }
        }
      });
   
  } catch (err) {
    console.log(err);
  }
  setTimeout(() => {
    getLuts();
  }, 1000);
}

setTimeout(() => {
  getLuts();
}, 1000);
app.listen("3000");
