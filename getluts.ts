import { AddressLookupTableProgram, Connection, GetProgramAccountsConfig, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
const PromisePool = require("@supercharge/promise-pool").default;
let theluts : any = {}

try {
  theluts = JSON.parse(fs.readFileSync('./powerfulluts.json').toString())
   
     } catch(err){
   
     }
import fs from 'fs'
setTimeout(async function(){
    while (true){

    try {
// invalid cache. I will recommend using a paid RPC endpoint.
let ALT_RPC_LIST=process.env.ALT_RPC_LIST
// @ts-ignore
let  ran = Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length / 2) + Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length / 2)
// @ts-ignore
var connection= new Connection(ALT_RPC_LIST?.split(',')[ran])

const configOrCommitment: GetProgramAccountsConfig = {
    commitment: 'confirmed',
    filters: [
     
    ],
  };
  console.log(Object.keys(theluts).length)
let myluts: any = {}

    let luts = await connection.getProgramAccounts(AddressLookupTableProgram.programId)
    console.log(Object.keys(luts).length)

    await PromisePool.withConcurrency(10)
    .for(luts)
    // @ts-ignore
    .handleError(async (err, asset) => {
      console.error(`\nError uploading or whatever`, err.message);
      console.log(err);
    })
    // @ts-ignore
    .process(async (lut: any) => {
// @ts-ignore
let ran = Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length / 2) + Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length / 2)
      // @ts-ignore
      var connection= new Connection(ALT_RPC_LIST?.split(',')[ran])

      let ammIdspks  = []
      
      try {
        ammIdspks = JSON.parse(fs.readFileSync('./ammIds.json').toString())
      } 
      catch (err){
        
      }
      let ammIds: any = []
      for (var ammId of ammIdspks){
        let ammIdpk = new PublicKey(ammId)
        if (!ammIds.includes(ammIdpk))
        ammIds.push(ammIdpk)
      }
      // @ts-ignore
      let maybemine = await connection.getAddressLookupTable(lut.pubkey)
      
if(maybemine.value?.state.addresses.length as number > 57){
    // @ts-ignore
    for (var addy of maybemine.value?.state.addresses){
let addypk = addy.toBase58()
for (var pk of ammIdspks){

    if ( pk === addypk && !Object.keys(theluts).includes(pk)){
        theluts[pk] = [lut.pubkey.toBase58()]
        console.log(Object.keys(theluts).length)

    } else if ( pk === addypk){
        if (!theluts[pk].includes(lut.pubkey.toBase58())){
    theluts[pk].push (lut.pubkey.toBase58())
        
}

    fs.writeFileSync('./tluts.json', JSON.stringify(theluts))
        //console.log(theluts[pk] .length)

       
}

}
    

    }
}

    })
    fs.writeFileSync('./luts.json', JSON.stringify(theluts))
} catch (err){
console.log(err)
}
}
})
