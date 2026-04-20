import type { NseIndia } from '../index.js';
export declare const mcpTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            symbol?: undefined;
            start_date?: undefined;
            end_date?: undefined;
            index?: undefined;
            index_symbol?: undefined;
            period?: undefined;
            sma_periods?: undefined;
            ema_periods?: undefined;
            rsi_period?: undefined;
            bb_period?: undefined;
            bb_std_dev?: undefined;
            show_only_latest?: undefined;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            symbol: {
                type: string;
                description: string;
            };
            start_date?: undefined;
            end_date?: undefined;
            index?: undefined;
            index_symbol?: undefined;
            period?: undefined;
            sma_periods?: undefined;
            ema_periods?: undefined;
            rsi_period?: undefined;
            bb_period?: undefined;
            bb_std_dev?: undefined;
            show_only_latest?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            symbol: {
                type: string;
                description: string;
            };
            start_date: {
                type: string;
                description: string;
            };
            end_date: {
                type: string;
                description: string;
            };
            index?: undefined;
            index_symbol?: undefined;
            period?: undefined;
            sma_periods?: undefined;
            ema_periods?: undefined;
            rsi_period?: undefined;
            bb_period?: undefined;
            bb_std_dev?: undefined;
            show_only_latest?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            index: {
                type: string;
                description: string;
            };
            symbol?: undefined;
            start_date?: undefined;
            end_date?: undefined;
            index_symbol?: undefined;
            period?: undefined;
            sma_periods?: undefined;
            ema_periods?: undefined;
            rsi_period?: undefined;
            bb_period?: undefined;
            bb_std_dev?: undefined;
            show_only_latest?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            index_symbol: {
                type: string;
                description: string;
            };
            symbol?: undefined;
            start_date?: undefined;
            end_date?: undefined;
            index?: undefined;
            period?: undefined;
            sma_periods?: undefined;
            ema_periods?: undefined;
            rsi_period?: undefined;
            bb_period?: undefined;
            bb_std_dev?: undefined;
            show_only_latest?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            symbol: {
                type: string;
                description: string;
            };
            period: {
                type: string;
                description: string;
            };
            sma_periods: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            ema_periods: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            rsi_period: {
                type: string;
                description: string;
            };
            bb_period: {
                type: string;
                description: string;
            };
            bb_std_dev: {
                type: string;
                description: string;
            };
            show_only_latest: {
                type: string;
                description: string;
            };
            start_date?: undefined;
            end_date?: undefined;
            index?: undefined;
            index_symbol?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleMCPToolCall(nseClient: NseIndia, name: string, args: Record<string, unknown>): Promise<unknown>;
//# sourceMappingURL=mcp-tools.d.ts.map