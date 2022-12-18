const fs = require("fs");
var anobj = JSON.parse(fs.readFileSync('taps.json').toString())
const {
  AddressLookupTableProgram,
  Connection,
  GetProgramAccountsConfig,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} = require("@solana/web3.js");
let ALT_RPC_LIST = process.env.ALT_RPC_LIST;
// @ts-ignore
let ran =
  Math.floor((Math.random() * ALT_RPC_LIST?.split(",").length) / 2) +
  Math.floor((Math.random() * ALT_RPC_LIST?.split(",").length) / 2);
// @ts-ignore
var connection = new Connection(ALT_RPC_LIST?.split(",")[ran]);

var acoolobj = JSON.parse(fs.readFileSync('./acoolobj.json').toString())
setTimeout(async function(){
for (var obj of anobj){
  try {
  acoolobj[obj] = parseFloat((await connection.getTokenAccountBalance(new PublicKey(obj))).value.amount)
  fs.writeFileSync('./acoolobj.json', JSON.stringify(acoolobj))
  }catch (err){
//    console.log(obj)
  }
}
})

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(bodyParser());
app.use(cors());

var reservePairs = {};
 // invalid cache. I will recommend using a paid RPC endpoint.

app.post("/", async function (req, res) {
  if (req.body.fee > 5000) {
  }
  try {
  } catch (err) {}
  var looking = []; 
  var rp = "";
  
  for (var abc of req.body[0].accountData) {
    if (abc.tokenBalanceChanges.length > 0) {
      for (var ch of abc.tokenBalanceChanges){    
      if (anobj.includes(ch.tokenAccount)){
        if (!Object.keys(acoolobj).includes(ch.tokenAccount)){
          acoolobj[ch.tokenAccount] = parseFloat((await connection.getTokenAccountBalance(new PublicKey(ch.tokenAccount))).value.amount)
          fs.writeFileSync('./acoolobj.json', JSON.stringify(acoolobj))
        }
        else {
          acoolobj[ch.tokenAccount] += parseFloat(ch.rawTokenAmount.tokenAmount)
          fs.writeFileSync('./acoolobj.json', JSON.stringify(acoolobj))
        }
          }
        }
      if (req.body[0].feePayer == abc.tokenBalanceChanges[0].userAccount) {
        looking.push(
          -1 * parseFloat(abc.tokenBalanceChanges[0].rawTokenAmount.tokenAmount)
        );
        rp +=abc.tokenBalanceChanges[0].mint +"-"
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
const PromisePool = require("@supercharge/promise-pool").default;
let luts = [];


let theluts = JSON.parse(fs.readFileSync('./luts.json').toString());
var connection
setTimeout(async function () {
  // invalid cache. I will recommend using a paid RPC endpoint.

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

        // @ts-ignore
        let maybemine = await connection.getAddressLookupTable(lut.pubkey);

        if (maybemine.value?.state.addresses.length > 66.6) {
          let templuts = [];
          if (true) {
            
            let gogo123 = true 
            // @ts-ignore

            for (var addy of maybemine.value?.state.addresses) {
              let addypk = addy.toBase58();
              let gogos = 0;
              for (var ammIdspks of Object.keys(reservePairs)) {
                for (var pk of reservePairs[ammIdspks]) {
                  try {
                    if (pk === addypk && !Object.keys(theluts).includes(ammIdspks)) {
                      //templuts.push(lut.pubkey.toBase58())
                      gogo123=true
                      console.log(gogo123)

                    } else if (pk === addypk) {
                      //  templuts.push(lut.pubkey.toBase58())

                      if (!theluts[ammIdspks].includes(lut.pubkey.toBase58())) {
                        gogo123 = true
                      }
                    }

                    //   fs.writeFileSync('./tluts.json', JSON.stringify(theluts))
                  } catch (err) {}
                }
              }
            }
            for (var addy of maybemine.value?.state.addresses) {
              let addypk = addy.toBase58();
              let gogos = 0;
              for (var ammIdspks of Object.keys(reservePairs)) {
                for (var pk of reservePairs[ammIdspks]) {
                  try {
                    if (pk === addypk && !Object.keys(theluts).includes(ammIdspks)) {
                      //templuts.push(lut.pubkey.toBase58())
                      theluts[ammIdspks] = [lut.pubkey.toBase58()];
                      console.log(Object.keys(theluts).length);
                      console.log(ammIdspks)
                      fs.writeFileSync("./luts.json", JSON.stringify(theluts));
                      gogos++;
                      
                    } else if (pk === addypk) {
                      //  templuts.push(lut.pubkey.toBase58())

                      if (!theluts[ammIdspks].includes(lut.pubkey.toBase58())) {
                        if(gogo123){
                      theluts[ammIdspks] = [lut.pubkey.toBase58()];
                        fs.writeFileSync("./luts.json", JSON.stringify(theluts));
                        gogos++;
                        }
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
