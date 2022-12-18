var anobj2 = []
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
    "webhookURL": "https://8399-2607-f7a0-d-a-ec4-7aff-fe18-ab7a.ngrok.io",
    "transactionTypes": ["Transfer", "Swap"],
    "accountAddresses": anobj2,
    "webhookType": "enhanced"
}

var request = require('request');

request.post(
    'https://api.helius.xyz/v0/webhooks?api-key=339338aa-3c41-41fa-9bbe-b1b0d5ce1d3b',
    { json: json },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
);


}, 100);