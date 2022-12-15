
require("dotenv").config();

import { AddressLookupTableProgram, Connection, GetProgramAccountsConfig, Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
const PromisePool = require("@supercharge/promise-pool").default;
let theluts : any = {}
import fs from 'fs'

try {
  theluts = JSON.parse(fs.readFileSync('./tluts.json').toString())
   
     } catch(err){
        try {
        theluts = JSON.parse(fs.readFileSync('./luts.json').toString())
        } catch (err)
   {} }
     console.log(Object.keys(theluts).length)
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

    let ammIdspks  : any = []
      
    try {
      ammIdspks = JSON.parse(fs.readFileSync('./ammIds.json').toString())
    } 
    catch (err){
      
    }
    let ammIds: any = []
    for (var ammId of ammIdspks){
      try {
      let ammIdpk = new PublicKey(ammId)
      if (!ammIds.includes(ammIdpk))
      ammIds.push(ammIdpk)
      } catch (err){}
    }
    await PromisePool.withConcurrency(5)
    .for(luts.reverse())
    // @ts-ignore
    .handleError(async (err, asset) => {
      console.error(`\nError uploading or whatever`, err.message);
      console.log(err);
    })
    // @ts-ignore
    .process(async (lut: any) => {
    
// @ts-ignore
let ran = Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length)
      // @ts-ignore
      var connection= new Connection(ALT_RPC_LIST?.split(',')[ran])

      // @ts-ignore
      let maybemine = await connection.getAddressLookupTable(lut.pubkey)
      
if(maybemine.value?.state.addresses.length as number > 10){
  let templuts : any = []
if (true){
// @ts-ignore
for (var addy of maybemine.value?.state.addresses){
  let addypk = addy.toBase58()
  let gogos = 0

  for (var pk of ammIdspks){
    try {
    if ( pk === addypk && !Object.keys(theluts).includes(pk)){
      //templuts.push(lut.pubkey.toBase58())
        theluts[pk] = [lut.pubkey.toBase58()]
       console.log(Object.keys(theluts).length)
       fs.writeFileSync('./luts.json', JSON.stringify(theluts))

      gogos++
    } else if ( pk === addypk){
    //  templuts.push(lut.pubkey.toBase58())

        if (!theluts[pk].includes(lut.pubkey.toBase58())){
  theluts[pk].push (lut.pubkey.toBase58())
      gogos++  
        }
}
    
    
 //   fs.writeFileSync('./tluts.json', JSON.stringify(theluts))
        //console.log(theluts[pk] .length)

       
}catch (err){
            
}
  }

  gogos > 1 ? console.log(gogos) : null
    
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
