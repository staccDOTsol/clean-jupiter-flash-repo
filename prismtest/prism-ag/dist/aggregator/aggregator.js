"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRoutes = exports.transitiveRoute = exports.splitRoute = exports.directRoute = exports.findDirectRoute = void 0;
const aldrin_1 = require("./aldrin");
const balansol_1 = require("./balansol");
const crema_1 = require("./crema");
const cropper_1 = require("./cropper");
const cykura_1 = require("./cykura");
const gooseFx_1 = require("./gooseFx");
const lifinity_1 = require("./lifinity");
const marinade_1 = require("./marinade");
const mercurial_1 = require("./mercurial");
const openbook_1 = require("./openbook");
const orca_1 = require("./orca");
const penguin_1 = require("./penguin");
const raydium_1 = require("./raydium");
const saber_1 = require("./saber");
const saros_1 = require("./saros");
const sencha_1 = require("./sencha");
const serum_1 = require("./serum");
const step_1 = require("./step");
const stepn_1 = require("./stepn");
const symmetry_1 = require("./symmetry");
function findDirectRoute(fromCoin, toCoin, amount, option, liquidityData, liquidityProviders, settings) {
    let route;
    try {
        switch (option.provider) {
            case "serum":
                route = (0, serum_1.serumRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "raydium":
                route = (0, raydium_1.raydiumRoute)(fromCoin, toCoin, amount, option, liquidityData, liquidityProviders, settings);
                break;
            case "aldrin":
                route = (0, aldrin_1.aldrinRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "saber":
                route = (0, saber_1.saberRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "orca":
                route = (0, orca_1.orcaRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "lifinity":
                route = (0, lifinity_1.lifinityRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "symmetry":
                route = (0, symmetry_1.symmetryRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "cropper":
                route = (0, cropper_1.cropperRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "sencha":
                route = (0, sencha_1.senchaRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "saros":
                route = (0, saros_1.sarosRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "step":
                route = (0, step_1.stepRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "penguin":
                route = (0, penguin_1.penguinRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "mercurial":
                route = (0, mercurial_1.mercurialRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "stepn":
                route = (0, stepn_1.stepnRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "marinade":
                route = (0, marinade_1.marinadeRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "crema":
                route = (0, crema_1.cremaRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "cykura":
                route = (0, cykura_1.cykuraRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "gooseFX":
                route = (0, gooseFx_1.gooseFxRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
                break;
            case "openbook":
                route = (0, openbook_1.openbookRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
            case "balansol":
                route = (0, balansol_1.balansolRoute)(fromCoin, toCoin, amount, option, liquidityData, settings);
            default:
                break;
        }
    }
    catch (_a) { }
    if (!route || !route.amountOut)
        route = { amountOut: 0 };
    return route;
}
exports.findDirectRoute = findDirectRoute;
function directRoute(route) {
    return Object.assign(Object.assign({ type: "direct" }, route), { split: [1], providers: [route.provider], priceDisplay: route.amountOut / route.amountIn });
}
exports.directRoute = directRoute;
function splitRoute(route1, route2, split) {
    return {
        type: "split",
        from: route1.from,
        amountIn: route1.amountIn + route2.amountIn,
        to: route1.to,
        amountOut: route1.amountOut + route2.amountOut,
        amountWithFees: route1.amountWithFees + route2.amountWithFees,
        minimumReceived: route1.minimumReceived + route2.minimumReceived,
        providers: [route1.provider, route2.provider],
        fees: { [route1.to]: route1.fees[route1.to] + route2.fees[route1.to] },
        priceImpact: Math.max(route1.priceImpact, route1.priceImpact),
        priceDisplay: (route1.amountOut + route2.amountOut) / (route1.amountIn + route2.amountIn),
        split: [split / 20, 1 - split / 20],
        routeData: {
            route1: route1,
            route2: route2,
            fromCoin: route1.routeData.fromCoin,
            toCoin: route1.routeData.toCoin,
        }
    };
}
exports.splitRoute = splitRoute;
function transitiveRoute(routeFrom, routeTo) {
    return {
        type: "transitive",
        from: routeFrom.from,
        amountIn: routeFrom.amountIn,
        mid: routeFrom.to,
        amountMid: routeFrom.amountOut,
        to: routeTo.to,
        amountOut: routeTo.amountOut,
        amountWithFees: routeTo.amountWithFees,
        minimumReceived: routeTo.minimumReceived,
        providers: [routeFrom.provider, routeTo.provider],
        fees: Object.assign(Object.assign({}, routeFrom.fees), routeTo.fees),
        priceImpact: Math.max(routeFrom.priceImpact, routeTo.priceImpact),
        priceDisplay: routeTo.amountOut / routeFrom.amountIn,
        split: [1, 1],
        routeData: {
            route1: routeFrom,
            route2: routeTo,
            fromCoin: routeFrom.routeData.fromCoin,
            midCoin: routeFrom.routeData.toCoin,
            toCoin: routeTo.routeData.toCoin,
        }
    };
}
exports.transitiveRoute = transitiveRoute;
function findRoutes(fromCoin, toCoin, amount, liquidityInfos, liquidityProviders, settings) {
    if (!liquidityInfos)
        return [];
    amount = parseFloat(amount.toString());
    let { routes, liquidityData } = liquidityInfos;
    let allRoutes = [];
    for (let [middleMint, data] of Object.entries(routes)) {
        if (middleMint == "direct") {
            let directRoutes = [];
            //@ts-ignore
            data.direct.forEach((option) => {
                let directRoute = findDirectRoute(fromCoin, toCoin, amount, option, liquidityData, liquidityProviders, settings);
                if (directRoute.amountOut > 0)
                    directRoutes.push(directRoute);
            });
            for (let i = 0; i < directRoutes.length; i++)
                allRoutes.push(directRoute(directRoutes[i]));
            let splits = {};
            //@ts-ignore
            data.direct.forEach((option) => {
                for (let div = 1; div <= 19; div++) {
                    (splits[div] || (splits[div] = [])).push(findDirectRoute(fromCoin, toCoin, amount * div / 20, option, liquidityData, liquidityProviders, settings));
                }
            });
            let splitRoutes = [];
            for (let i = 19; i >= 10; i--) {
                if (!splits[i] || !splits[20 - i])
                    continue;
                splits[i].sort((a, b) => { return b.amountOut - a.amountOut; });
                for (let f = 0; f < Math.min(2, splits[i].length); f++)
                    for (let s = 0; s < Math.min(3, splits[20 - i].length); s++) {
                        if (splits[i][f].amountOut == 0 || splits[20 - i][s].amountOut == 0)
                            continue;
                        let pA = splits[i][f].provider;
                        let pB = splits[20 - i][s].provider;
                        if ((pA == pB) || (pA == "serum" && pB == "raydium") || (pA == "raydium" && pB == "serum") ||
                            (pA == "gooseFX" && pB == "raydium") || (pA == "raydium" && pB == "gooseFX"))
                            continue;
                        if (pA == "symmetry" || pB == "symmetry")
                            continue;
                        splitRoutes.push(splitRoute(splits[i][f], splits[20 - i][s], i));
                    }
            }
            splitRoutes.sort((a, b) => { return b.amountOut - a.amountOut; });
            let pairs = {};
            for (let i = 0; i < splitRoutes.length; i++) {
                if (pairs[splitRoutes[i].providers[0] + splitRoutes[i].providers[1]])
                    continue;
                if (pairs[splitRoutes[i].providers[1] + splitRoutes[i].providers[0]])
                    continue;
                pairs[splitRoutes[i].providers[0] + splitRoutes[i].providers[1]] = true;
                pairs[splitRoutes[i].providers[1] + splitRoutes[i].providers[0]] = true;
                allRoutes.push(splitRoutes[i]);
            }
            continue;
        }
        //@ts-ignore
        let { coin, from, to } = data;
        let fromRoutes = [];
        from.forEach((option) => fromRoutes.push(findDirectRoute(fromCoin, coin, amount, option, liquidityData, liquidityProviders, settings)));
        fromRoutes.sort((a, b) => b.amountOut - a.amountOut);
        for (let i = 0; i < Math.min(3, fromRoutes.length); i++) {
            if (!(fromRoutes[i].amountOut > 0))
                continue;
            let toRoutes = [];
            to.forEach((option) => toRoutes.push(findDirectRoute(coin, toCoin, fromRoutes[i].amountOut, option, liquidityData, liquidityProviders, settings)));
            toRoutes.sort((a, b) => { return b.amountOut - a.amountOut; });
            for (let j = 0; j < Math.min(3, toRoutes.length); j++)
                if (toRoutes[j].amountOut > 0) {
                    if (fromRoutes[i].provider == "symmetry" || toRoutes[j].provider == "symmetry")
                        continue;
                    if (fromRoutes[i].provider == 'gooseFX' && toRoutes[j].provider == "raydium")
                        continue;
                    if (fromRoutes[i].provider == 'raydium' && toRoutes[j].provider == "gooseFX")
                        continue;
                    if (fromRoutes[i].provider == 'openbook' && toRoutes[j].provider == "raydium")
                        continue;
                    if (fromRoutes[i].provider == 'raydium' && toRoutes[j].provider == "openbook")
                        continue;
                    allRoutes.push(transitiveRoute(fromRoutes[i], toRoutes[j]));
                }
        }
    }
    allRoutes.sort((a, b) => { return b.amountOut - a.amountOut; });
    return allRoutes;
}
exports.findRoutes = findRoutes;
