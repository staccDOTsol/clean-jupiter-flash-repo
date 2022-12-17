"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInstruction = exports.LendingInstruction = void 0;
var LendingInstruction;
(function (LendingInstruction) {
    LendingInstruction[LendingInstruction["InitLendingMarket"] = 0] = "InitLendingMarket";
    LendingInstruction[LendingInstruction["SetLendingMarketOwner"] = 1] = "SetLendingMarketOwner";
    LendingInstruction[LendingInstruction["InitReserve"] = 2] = "InitReserve";
    LendingInstruction[LendingInstruction["RefreshReserve"] = 3] = "RefreshReserve";
    LendingInstruction[LendingInstruction["DepositReserveLiquidity"] = 4] = "DepositReserveLiquidity";
    LendingInstruction[LendingInstruction["RedeemReserveCollateral"] = 5] = "RedeemReserveCollateral";
    LendingInstruction[LendingInstruction["InitObligation"] = 6] = "InitObligation";
    LendingInstruction[LendingInstruction["RefreshObligation"] = 7] = "RefreshObligation";
    LendingInstruction[LendingInstruction["DepositObligationCollateral"] = 8] = "DepositObligationCollateral";
    LendingInstruction[LendingInstruction["WithdrawObligationCollateral"] = 9] = "WithdrawObligationCollateral";
    LendingInstruction[LendingInstruction["BorrowObligationLiquidity"] = 10] = "BorrowObligationLiquidity";
    LendingInstruction[LendingInstruction["RepayObligationLiquidity"] = 11] = "RepayObligationLiquidity";
    LendingInstruction[LendingInstruction["LiquidateObligation"] = 12] = "LiquidateObligation";
    LendingInstruction[LendingInstruction["FlashLoan"] = 13] = "FlashLoan";
    LendingInstruction[LendingInstruction["DepositReserveLiquidityAndObligationCollateral"] = 14] = "DepositReserveLiquidityAndObligationCollateral";
    LendingInstruction[LendingInstruction["WithdrawObligationCollateralAndRedeemReserveLiquidity"] = 15] = "WithdrawObligationCollateralAndRedeemReserveLiquidity";
    LendingInstruction[LendingInstruction["UpdateReserveConfig"] = 16] = "UpdateReserveConfig";
    LendingInstruction[LendingInstruction["FlashBorrowReserveLiquidity"] = 19] = "FlashBorrowReserveLiquidity";
    LendingInstruction[LendingInstruction["FlashRepayReserveLiquidity"] = 20] = "FlashRepayReserveLiquidity";
})(LendingInstruction = exports.LendingInstruction || (exports.LendingInstruction = {}));
/** Instructions defined by the program */
var TokenInstruction;
(function (TokenInstruction) {
    TokenInstruction[TokenInstruction["InitializeMint"] = 0] = "InitializeMint";
    TokenInstruction[TokenInstruction["InitializeAccount"] = 1] = "InitializeAccount";
    TokenInstruction[TokenInstruction["InitializeMultisig"] = 2] = "InitializeMultisig";
    TokenInstruction[TokenInstruction["Transfer"] = 3] = "Transfer";
    TokenInstruction[TokenInstruction["Approve"] = 4] = "Approve";
    TokenInstruction[TokenInstruction["Revoke"] = 5] = "Revoke";
    TokenInstruction[TokenInstruction["SetAuthority"] = 6] = "SetAuthority";
    TokenInstruction[TokenInstruction["MintTo"] = 7] = "MintTo";
    TokenInstruction[TokenInstruction["Burn"] = 8] = "Burn";
    TokenInstruction[TokenInstruction["CloseAccount"] = 9] = "CloseAccount";
    TokenInstruction[TokenInstruction["FreezeAccount"] = 10] = "FreezeAccount";
    TokenInstruction[TokenInstruction["ThawAccount"] = 11] = "ThawAccount";
    TokenInstruction[TokenInstruction["TransferChecked"] = 12] = "TransferChecked";
    TokenInstruction[TokenInstruction["ApproveChecked"] = 13] = "ApproveChecked";
    TokenInstruction[TokenInstruction["MintToChecked"] = 14] = "MintToChecked";
    TokenInstruction[TokenInstruction["BurnChecked"] = 15] = "BurnChecked";
    TokenInstruction[TokenInstruction["InitializeAccount2"] = 16] = "InitializeAccount2";
    TokenInstruction[TokenInstruction["SyncNative"] = 17] = "SyncNative";
    TokenInstruction[TokenInstruction["InitializeAccount3"] = 18] = "InitializeAccount3";
    TokenInstruction[TokenInstruction["InitializeMultisig2"] = 19] = "InitializeMultisig2";
    TokenInstruction[TokenInstruction["InitializeMint2"] = 20] = "InitializeMint2";
})(TokenInstruction = exports.TokenInstruction || (exports.TokenInstruction = {}));
