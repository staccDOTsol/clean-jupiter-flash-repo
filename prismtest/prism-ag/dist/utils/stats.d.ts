export declare const TRADE_HISTORY_API = "https://mo5mnc5gt4.execute-api.eu-central-1.amazonaws.com/prod/user-stats/tr-history";
export declare const GLOBAL_STATS_API = "https://mo5mnc5gt4.execute-api.eu-central-1.amazonaws.com/prod/prism-stats";
export declare const SAVE_USER_TRADE = "https://mo5mnc5gt4.execute-api.eu-central-1.amazonaws.com/prod/transaction_queue";
export declare function en(input: any, ps: any, callback: any): void;
export declare function getStats(settings: any, user: any, route: any, result: any, toFees: any, midFees: any, fromT: any, midT: any, toT: any): {
    owner: any;
    host: any;
    from_account: any;
    from_mint: any;
    from_amount: any;
    type: any;
    mid_account: any;
    mid_mint: any;
    mid_amount: any;
    to_account: any;
    to_mint: any;
    to_amount: any;
    sig: any;
    fees: {
        is_host: boolean;
        mint: any;
        account: any;
    }[];
    routes: any;
    split: any;
    message: string;
};
