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
let  connection = new Connection((process.env.NODE_ENV == 'production' ? 'https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ' : 'https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ'));
let ALT_RPC_LIST="https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn,https://solana-mainnet.g.alchemy.com/v2/QlAFXUZhGG-CoVy9r6vYAbsA7iiDnA9-,https://solana-mainnet.g.alchemy.com/v2/ETWO1_-exD_tuIyq9YTW9d37nAvNT7XQ,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/dVWUMrayL_U3UbmCbg0mouE9q4mUZfuc,https://solana-mainnet.g.alchemy.com/v2/WM_Gl7ktiws7icLQVxLP5iVHNQTv8RNk,https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn"
// @ts-ignore
let ran = Math.floor(Math.random()*ALT_RPC_LIST?.split(',').length)
// @ts-ignore
var connection2= new Connection(ALT_RPC_LIST?.split(',')[ran])

process.env.SEARCHER ? connection = connection2 : connection = connection
const configOrCommitment: GetProgramAccountsConfig = {
    commitment: 'confirmed',
    filters: [
     
    ],
  };
let myluts: any = {}

    let luts = await connection2.getProgramAccounts(AddressLookupTableProgram.programId)
    console.log(luts.length)
    await PromisePool.withConcurrency(200)
    .for(luts)
    // @ts-ignore
    .handleError(async (err, asset) => {
      console.error(`\nError uploading or whatever`, err.message);
      console.log(err);
    })
    // @ts-ignore
    .process(async (lut: any) => {
      var connection2= new Connection(ALT_RPC_LIST?.split(',')[ran])

      let ammIdspks = JSON.parse(fs.readFileSync('./ammIds.json').toString())
      
      let ammIds: any = []
      for (var ammId of ammIdspks){
        let ammIdpk = new PublicKey(ammId)
        if (!ammIds.includes(ammIdpk))
        ammIds.push(ammIdpk)
      }
    console.log(ammIds.length)
    
      // @ts-ignore
      let maybemine = await connection2.getAddressLookupTable(lut.pubkey)
      
if(maybemine.value?.state.addresses.length as number > 7){
    // @ts-ignore
    for (var addy of maybemine.value?.state.addresses){
let addypk = addy.toBase58()
for (var pk of ammIdspks){

    if ( pk === addypk && !Object.keys(theluts).includes(pk)){
        theluts[pk] = [lut.pubkey.toBase58()]

    } else if ( pk === addypk){
        if (!theluts[pk].includes(lut.pubkey.toBase58())){
    theluts[pk].push (lut.pubkey.toBase58())
        }

   console.log(Object.keys(theluts).length)
   console.log(theluts[pk].length)
    fs.writeFileSync('./tluts.json', JSON.stringify(theluts))
        //console.log(theluts[pk] .length)

       
}

}
    

    }
}

    })
    console.log(Object.keys(theluts).length)
    fs.writeFileSync('./luts.json', JSON.stringify(theluts))
} catch (err){

}
}
})
