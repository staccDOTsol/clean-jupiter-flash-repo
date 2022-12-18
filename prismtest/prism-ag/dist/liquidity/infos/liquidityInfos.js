"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLiquidityInfos = exports.possibleRoutes = void 0;
const types_1 = require("../../types/types");
const aldrin_1 = require("./aldrin");
const cropper_1 = require("./cropper");
const lifinity_1 = require("./lifinity");
const orca_1 = require("./orca");
const raydium_1 = require("./raydium");
const saber_1 = require("./saber");
const serum_1 = require("./serum");
const sencha_1 = require("./sencha");
const symmetry_1 = require("./symmetry");
const saros_1 = require("./saros");
const step_1 = require("./step");
const penguin_1 = require("./penguin");
const mercurial_1 = require("./mercurial");
const cykura_1 = require("./cykura");
const stepn_1 = require("./stepn");
const gooseFx_1 = require("./gooseFx");
const getMultInfo_1 = require("../../utils/getMultInfo");
const openbook_1 = require("./openbook");
function possibleRoutes(fromCoin, toCoin, LI, tokenMap, direct) {
    let directOptions = [];
    let allFromOptions = {};
    let allToOptions = {};
    if (LI[fromCoin.mintAddress])
        for (let i = 0; i < LI[fromCoin.mintAddress].length; i++) {
            let other = LI[fromCoin.mintAddress][i].other;
            if (other == fromCoin.mintAddress)
                continue;
            // if (unKnownSerumMarket(fromCoin.mintAddress, other, knownPairs, LI[fromCoin.mintAddress][i]))
            //     continue;
            if (other == toCoin.mintAddress) {
                directOptions.push(LI[fromCoin.mintAddress][i]);
                continue;
            }
            if (direct)
                continue;
            if (LI[fromCoin.mintAddress][i].provider == "serum" &&
                !types_1.MIDDLE_COINS.find(object => object.mintAddress == other))
                continue;
            (allFromOptions[other] || (allFromOptions[other] = []))
                .push(LI[fromCoin.mintAddress][i]);
        }
    if (LI[toCoin.mintAddress])
        for (let i = 0; i < LI[toCoin.mintAddress].length; i++) {
            let other = LI[toCoin.mintAddress][i].other;
            if (other == fromCoin.mintAddress || other == toCoin.mintAddress)
                continue;
            if (!allFromOptions[other])
                continue;
            // if (unKnownSerumMarket(toCoin.mintAddress, other, knownPairs, LI[toCoin.mintAddress][i]))
            //     continue;
            if (LI[toCoin.mintAddress][i].provider == "serum" &&
                !types_1.MIDDLE_COINS.find(object => object.mintAddress == other))
                continue;
            (allToOptions[other] || (allToOptions[other] = []))
                .push(LI[toCoin.mintAddress][i]);
        }
    let toLoad = {};
    let routes = {};
    for (let [middleMint, options] of Object.entries(allToOptions)) {
        let midCoin = tokenMap[middleMint];
        if (!midCoin)
            continue;
        // if (midCoin.decimals == 0)continue;
        if (!routes[middleMint])
            routes[middleMint] = { from: [], to: [], coin: midCoin };
        for (let i = 0; i < allFromOptions[middleMint].length; i++) {
            if (!toLoad[allFromOptions[middleMint][i].provider])
                toLoad[allFromOptions[middleMint][i].provider] = [];
            toLoad[allFromOptions[middleMint][i].provider].push(Object.assign(Object.assign({}, allFromOptions[middleMint][i]), { middleCoin: middleMint, side: "from" }));
            routes[middleMint].from.push(allFromOptions[middleMint][i]);
        }
        //@ts-ignore
        for (let i = 0; i < options.length; i++) {
            //@ts-ignore
            if (!toLoad[options[i].provider])
                toLoad[options[i].provider] = [];
            //@ts-ignore
            toLoad[options[i].provider].push(Object.assign(Object.assign({}, options[i]), { middleMint: middleMint, side: "to" }));
            //@ts-ignore
            routes[middleMint].to.push(options[i]);
        }
    }
    routes.direct = { direct: [] };
    for (let i = 0; i < directOptions.length; i++) {
        if (!toLoad[directOptions[i].provider])
            toLoad[directOptions[i].provider] = [];
        toLoad[directOptions[i].provider].push(Object.assign(Object.assign({}, directOptions[i]), { middleMint: "direct", side: "direct" }));
        routes.direct.direct.push(directOptions[i]);
    }
    return {
        routes: routes,
        toLoad: toLoad,
    };
}
const fs = require('fs');
const { BN } = require("bn.js");
const acoolobj = JSON.parse(fs.readFileSync('./acoolobj.json').toString())
exports.possibleRoutes = possibleRoutes;
function loadLiquidityInfos(fromCoin, toCoin, oldData, LI, connection, tokenMap, direct, reverse) {
    return __awaiter(this, void 0, void 0, function* () {
        let time = Date.now();
        let { routes, toLoad } = possibleRoutes(fromCoin, toCoin, LI, tokenMap, direct);
        if (reverse) {
            return routes;
        }
        let liquidityData
        if (oldData == undefined){
        let pubkeys = [
            ...(0, serum_1._loadSerum)(toLoad.serum),
            ...(0, raydium_1._loadRaydium)(toLoad.raydium),
            ...(0, saber_1._loadSaber)(toLoad.saber),
            ...(0, aldrin_1._loadAldrin)(toLoad.aldrin),
            ...(0, orca_1._loadOrca)(toLoad.orca),
            ...(0, lifinity_1._loadLifinity)(toLoad.lifinity),
            ...(0, symmetry_1._loadSymmetry)(toLoad.symmetry),
            ...(0, cropper_1._loadCropper)(toLoad.cropper),
            ...(0, sencha_1._loadSencha)(toLoad.sencha),
            ...(0, saros_1._loadSaros)(toLoad.saros),
            ...(0, step_1._loadStep)(toLoad.step),
            ...(0, penguin_1._loadPenguin)(toLoad.penguin),
            ...(0, mercurial_1._loadMercurial)(toLoad.mercurial),
            ...(0, stepn_1._loadStepn)(toLoad.stepn),
            ...(0, cykura_1._loadCykura)(toLoad.cykura),
            ...(0, gooseFx_1._loadGooseFx)(toLoad.gooseFX),
            ...(0, openbook_1._loadOpenbook)(toLoad.openbook),
        ];
        let [parsed, slot] = yield Promise.all([
            (0, getMultInfo_1.customGetMultipleAccountInfos)(connection, pubkeys.map(x => x.account), "Fetch liquidity infos"),
            connection.getSlot()
        ]);
        let parsedInfo = {};
        for (let i = 0; i < parsed.length; i++)
            (parsedInfo[pubkeys[i].provider] || (parsedInfo[pubkeys[i].provider] = []))
                .push(parsed[i]);
         liquidityData = {
            serumData: (0, serum_1.loadSerum)(toLoad.serum, tokenMap, parsedInfo.serum),
            raydiumData: (0, raydium_1.loadRaydium)(toLoad.raydium, parsedInfo.raydium),
            saberData: (0, saber_1.loadSaber)(toLoad.saber, parsedInfo.saber),
            aldrinData: (0, aldrin_1.loadAldrin)(toLoad.aldrin, parsedInfo.aldrin),
            orcaData: (0, orca_1.loadOrca)(toLoad.orca, parsedInfo.orca),
            lifinityData: (0, lifinity_1.loadLifinity)(toLoad.lifinity, parsedInfo.lifinity, slot),
            symmetryData: (0, symmetry_1.loadSymmetry)(toLoad.symmetry, parsedInfo.symmetry),
            cropperData: (0, cropper_1.loadCropper)(toLoad.cropper, parsedInfo.cropper),
            senchaData: (0, sencha_1.loadSencha)(toLoad.sencha, parsedInfo.sencha),
            sarosData: (0, saros_1.loadSaros)(toLoad.saros, parsedInfo.saros),
            stepData: (0, step_1.loadStep)(toLoad.step, parsedInfo.step),
            penguinData: (0, penguin_1.loadPenguin)(toLoad.penguin, parsedInfo.penguin),
            mercurialData: (0, mercurial_1.loadMercurial)(toLoad.mercurial, parsedInfo.mercurial),
            stepnData: (0, stepn_1.loadStepn)(toLoad.stepn, parsedInfo.stepn),
            cykuraData: (0, cykura_1.loadCykura)(toLoad.cykura, connection, parsedInfo.cykura),
            gooseFxData: (0, gooseFx_1.loadGooseFx)(toLoad.gooseFX, parsedInfo.gooseFX),
            openbookData: (0, openbook_1.loadOpenbook)(toLoad.openbook, tokenMap, parsedInfo.openbook),
        };
        oldData=liquidityData
        let i = -1
        let taps =  []
        let tapf = JSON.parse(fs.readFileSync('./taps.json').toString())

        for (var data of Object.values(liquidityData)){
            i++
            let b = -1
            for (var coin of Object.values(data)){
                b++
            try {
                let c = -1
                for (var ta of coin.tokenAccounts){
                    try {
                    c++
                    let tap = ta.toBase58()
                        if (!tapf.includes(tap)){
                            tapf.push(tap)
                        }
                    } catch (err){

                    }
                }
            } catch (err){
                        
            }
    }
}
fs.writeFileSync('taps.json', JSON.stringify(tapf))
console.log(tapf.length)
    }else {
        let i = -1;
        let tl = {}
        for (var data of Object.values(oldData)){
            i++
            let b = -1
            for (var coin of Object.keys(data)){
                b++
        for(var abc of Object.keys(acoolobj)){
            try {
                let c = -1
                for (var ta of data[coin].tokenAccounts){

                    try {
                    c++
                    let tap = ta.toBase58()
                        if (tap == abc){
                            data[coin].tokenAmounts[c] = new BN( Object.values(acoolobj)[b] )
                            tl[Object.keys(oldData)[i]] = data[coin]
                    console.log(Object.values(acoolobj)[b])
                    }
                } catch (err){
                    console.log(err)
                }
                }
            } catch (err){
            }   
        }
         
        }
        }
        liquidityData = tl
      //  if ()
}
console.log(routes.length)
        return {
            routes: routes,
            liquidityData: liquidityData,
            oldData: oldData
        };
    });
}
exports.loadLiquidityInfos = loadLiquidityInfos;