export declare type PrismAg = {
    "version": "0.2.0";
    "name": "prism_ag";
    "instructions": [
        {
            "name": "init";
            "accounts": [
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "raydiumSwap";
            "accounts": [
                {
                    "name": "raydiumLiquidityPool";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "serumDexProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "raydiumInfo";
                    "accounts": [
                        {
                            "name": "ammId";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "ammAuthority";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "ammOpenOrders";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "poolCoinTokenAccount";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "poolPcTokenAccount";
                            "isMut": true;
                            "isSigner": false;
                        }
                    ];
                },
                {
                    "name": "serumInfo";
                    "accounts": [
                        {
                            "name": "market";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "bids";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "asks";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "eventQueue";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "coinVault";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "pcVault";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "vaultSigner";
                            "isMut": true;
                            "isSigner": false;
                        }
                    ];
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "feesDisabled";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "serumSwap";
            "accounts": [
                {
                    "name": "serumDexProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "serumInfo";
                    "accounts": [
                        {
                            "name": "market";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "bids";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "asks";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "eventQueue";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "coinVault";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "pcVault";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "vaultSigner";
                            "isMut": true;
                            "isSigner": false;
                        }
                    ];
                },
                {
                    "name": "openOrders";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "requestQueue";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "referral";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "side";
                    "type": "u8";
                },
                {
                    "name": "feesDisabled";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "aldrinSwap";
            "accounts": [
                {
                    "name": "aldrinLiquidityPool";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "poolPublickey";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolSigner";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "baseTokenVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "quoteTokenVault";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feePoolTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "side";
                    "type": "u8";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "saberSwap";
            "accounts": [
                {
                    "name": "saberStableSwap";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "clock";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapAuthority";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "adminDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "orcaSwap";
            "accounts": [
                {
                    "name": "orcaTokenSwap";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenSwap";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapAuthority";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "adminDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "cremaSwap";
            "accounts": [
                {
                    "name": "cremaTokenSwap";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenSwapKey";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "cremaAuthority";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "ticksKey";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "lifinitySwap";
            "accounts": [
                {
                    "name": "lifinityTokenSwap";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "lifinityAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "lifinityAmm";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "pythPcAccount";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "pythAccount";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "configAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "symmetrySwap";
            "accounts": [
                {
                    "name": "symmetryProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "buyer";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fundState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "pdaAccount";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "pdaFromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "buyerFromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "pdaToTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "buyerToTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapFeeAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "hostFeeAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "managerFeeAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenInfo";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "prismData";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "fromTokenId";
                    "type": "u64";
                },
                {
                    "name": "toTokenId";
                    "type": "u64";
                },
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "amountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "mercurialSwap";
            "accounts": [
                {
                    "name": "mercurialProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapInfo";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userTransferAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "userSourceTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userDestinationTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "cropperSwap";
            "accounts": [
                {
                    "name": "cropperProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swap";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userTransferAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "state";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "source";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "destination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "senchaSwap";
            "accounts": [
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "senchaProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swap";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "userTokenAccountA";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserveTokenAccountA";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feesAccountA";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userTokenAccountB";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "reserveTokenAccountB";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feesAccountB";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "sarosSwap";
            "accounts": [
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "sarosProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapInfo";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userTransferAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "source";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "destination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolFee";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "stepSwap";
            "accounts": [
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "stepProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapInfo";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userTransferAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "source";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "destination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "refundTo";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "penguinSwap";
            "accounts": [
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "penguinProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapInfo";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userTransferAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "source";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "destination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolFee";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "cykuraSwap";
            "accounts": [
                {
                    "name": "signer";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "factoryState";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "source";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "coreProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "bitmapNum";
                    "type": "u8";
                },
                {
                    "name": "deadline";
                    "type": "i64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "stepnSwap";
            "accounts": [
                {
                    "name": "stepnProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapInfo";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "swapAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userTransferAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "source";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapSource";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swapDestination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "destination";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "poolFee";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "marinadeStake";
            "accounts": [
                {
                    "name": "userAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "marinadeProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "state";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "msolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "liqPoolSolLegPda";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "liqPoolMsolLeg";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "liqPoolMsolLegAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "reservePda";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userWsolAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transferFrom";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "transferFromWsolAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "mintTo";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "msolMintAuthority";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "marinadeUnstake";
            "accounts": [
                {
                    "name": "userAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "marinadeProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "state";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "msolMint";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "liqPoolSolLegPda";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "liqPoolMsolLeg";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "treasuryMsolAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userMsolAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "solReceiver";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "userWsolAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "goosefxSwap";
            "accounts": [
                {
                    "name": "goosefxProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "controller";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "pair";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "sslIn";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "sslOut";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "liabilityVaultIn";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "liabilityVaultOut";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swappedLiabilityVaultIn";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "swappedLiabilityVaultOut";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userSourceTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "userDestinationTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeCollectorAta";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "user";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "feeCollector";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "openbookSwap";
            "accounts": [
                {
                    "name": "serumDexProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "serumInfo";
                    "accounts": [
                        {
                            "name": "market";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "bids";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "asks";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "eventQueue";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "coinVault";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "pcVault";
                            "isMut": true;
                            "isSigner": false;
                        },
                        {
                            "name": "vaultSigner";
                            "isMut": true;
                            "isSigner": false;
                        }
                    ];
                },
                {
                    "name": "openOrders";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "requestQueue";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "fromTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "toTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "referral";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "side";
                    "type": "u8";
                },
                {
                    "name": "feesDisabled";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "balansolSwap";
            "accounts": [
                {
                    "name": "balansolProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "userAuthority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "pool";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "taxman";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "bidMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "treasurer";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "srcTreasury";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "srcAssociatedTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "askMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "dstTreasuty";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "dstAssociatedTokenAccount";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "dstTokenAccountTaxman";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "associatedTokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "tokenProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "host";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "feeSweeper";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "transitiveState";
                    "isMut": true;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "amountIn";
                    "type": "u64";
                },
                {
                    "name": "minimumAmountOut";
                    "type": "u64";
                },
                {
                    "name": "useTransitiveAmount";
                    "type": "bool";
                },
                {
                    "name": "hostFees";
                    "type": "u8";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "transitiveState";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "amount";
                        "type": "u64";
                    },
                    {
                        "name": "effectiveAmount";
                        "type": "u64";
                    }
                ];
            };
        }
    ];
    "types": [
        {
            "name": "Side";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Bid";
                    },
                    {
                        "name": "Ask";
                    }
                ];
            };
        },
        {
            "name": "Side";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Bid";
                    },
                    {
                        "name": "Ask";
                    }
                ];
            };
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "SwapTokensCannotMatch";
            "msg": "The tokens being swapped must have different mints";
        },
        {
            "code": 6001;
            "name": "SlippageExceeded";
            "msg": "Slippage tolerance exceeded";
        }
    ];
};
export declare const PrismIDL: PrismAg;
