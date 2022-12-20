var anobj2 = ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"]
let acoolobj = {}
const fs = require('fs')
var anobj = JSON.parse(fs.readFileSync('./taps.json').toString())

const { Connection, PublicKey } = require('@solana/web3.js')
setTimeout(async() => {
        try {
            var anobj = JSON.parse(fs.readFileSync('./taps.json').toString())

    let connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/1_5YWfzLWXOo_Y_Dm0s89VTlD5T_RKHn")

for (var aaa of anobj){
    if (!anobj2.includes(aaa)){
        try{
        anobj2.push(aaa)
        acoolobj[aaa] = parseFloat((await connection.getTokenAccountBalance(new PublicKey(aaa))).value.amount)
          fs.writeFileSync('./acoolobj.json', JSON.stringify(acoolobj))
          console.log(acoolobj[aaa] )
        }
        catch (err){
console.log(err)
        }
        }
   
    }
}
catch (err){


}



//https://rpc.helius.xyz/?api-key=6b1ccd35-ba2d-472a-8f54-9ac2c3c40b8b


//
const json  ={
    "webhookURL": "http://172.105.21.215:3001",
    "transactionTypes": ["ADD_TOKEN_TO_VAULT","LOAN","REPAY_LOAN","DEPOSIT","WITHDRAW","UNSTAKE_TOKEN","STAKE_TOKEN","ADD_TO_POOL","REMOVE_FROM_POOL"],
    "accountAddresses": anobj2,
    "webhookType": "enhanced"
}

var request = require('request');

request.post(
    'https://api.helius.xyz/v0/webhooks?api-key=6a839ee9-3c7f-47f1-b40a-ade585ba25ff',
    { json: json },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
);


}, 100);