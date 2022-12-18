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
exports.loadLiquidityProviders = exports.getCacheData = void 0;
const aldrin_1 = require("./aldrin");
const balansol_1 = require("./balansol");
const cropper_1 = require("./cropper");
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
function getCacheData(connection, disableCache) {
    return __awaiter(this, void 0, void 0, function* () {
        let cacheData = {};
        // if (disableCache)
        yield Promise.all([
            (0, cropper_1.getCropperCacheData)(connection).then(res => cacheData.cropper = res),
            (0, mercurial_1.getMercurialCacheData)(connection).then(res => cacheData.mercurial = res),
            (0, penguin_1.getPenguinCacheData)(connection).then(res => cacheData.penguin = res),
            (0, raydium_1.getRaydiumCacheData)(connection).then(res => cacheData.raydium = res),
            (0, saber_1.getSaberCacheData)(connection).then(res => cacheData.saber = res),
            (0, saros_1.getSarosCacheData)(connection).then(res => cacheData.saros = res),
            (0, sencha_1.getSenchaCacheData)(connection).then(res => cacheData.sencha = res),
            (0, serum_1.getSerumCacheData)(connection).then(res => cacheData.serum = res),
            (0, step_1.getStepCacheData)(connection).then(res => cacheData.step = res),
            (0, symmetry_1.getSymmetryCacheData)(connection).then(res => cacheData.symmetry = res),
            (0, gooseFx_1.getGooseFxCacheData)(connection).then(res => cacheData.gooseFx = res),
            (0, aldrin_1.getAldrinCacheData)(connection).then(res => cacheData.aldrin = res),
            (0, openbook_1.getOpenbookCacheData)(connection).then(res => cacheData.openbook = res),
            (0, balansol_1.getBalansolCacheData)(connection).then(res => cacheData.balansol = res),
        ]);
        return cacheData;
    });
}
exports.getCacheData = getCacheData;
function loadLiquidityProviders(connection, liqProviders, disableCache) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = yield getCacheData(connection, disableCache);
        let results = [
            /* getCremaPools(connection), */
            liqProviders.serum ? (0, serum_1.getSerumMarkets)(data.serum) : {},
            liqProviders.saber ? (0, saber_1.getSaberPools)(data.saber) : {},
            liqProviders.raydium ? (0, raydium_1.getRaydiumAmms)(data.raydium) : {},
            liqProviders.aldrin ? (0, aldrin_1.getAldrinPools)(connection, data.aldrin) : {},
            liqProviders.orca ? (0, orca_1.getOrcaPools)(connection) : {},
            liqProviders.lifinity ? (0, lifinity_1.getLifinityPools)() : {},
            liqProviders.symmetry ? (0, symmetry_1.getSymmetryFunds)(data.symmetry) : {},
            liqProviders.cropper ? (0, cropper_1.getCropperPools)(data.cropper) : {},
            liqProviders.sencha ? (0, sencha_1.getSenchaPools)(data.sencha) : {},
            liqProviders.saros ? (0, saros_1.getSarosPools)(data.saros) : {},
            liqProviders.step ? (0, step_1.getStepPools)(data.step) : {},
            liqProviders.penguin ? (0, penguin_1.getPenguinPools)(data.penguin) : {},
            liqProviders.mercurial ? (0, mercurial_1.getMercurialPools)(data.mercurial) : {},
            liqProviders.stepn ? (0, stepn_1.getStepnPools)() : {},
            liqProviders.marinade ? (0, marinade_1.getMarinadePools)() : {},
            // liqProviders.cykura ? getCykuraPools(connection), 
            liqProviders.gooseFX ? (0, gooseFx_1.getGooseFxPools)(connection, data.gooseFx) : {},
            liqProviders.balansol ? (0, balansol_1.getBalansolPools)(data.balansol) : {},
            liqProviders.openbook ? (0, openbook_1.getOpenbookMarkets)(data.openbook) : {},
        ];
        let combinedOptions = { all: {} };
        for (let i = 0; i < results.length; i++)
            for (let [mint, info] of Object.entries(results[i])) {
                if (mint == "all") {
                    combinedOptions.all = info;
                    continue;
                }
                //@ts-ignore
                for (let j = 0; j < info.length; j++)
                    //@ts-ignore
                    (combinedOptions[mint] || (combinedOptions[mint] = [])).push(info[j]);
            }
        return combinedOptions;
    });
}
exports.loadLiquidityProviders = loadLiquidityProviders;
