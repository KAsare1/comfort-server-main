export declare enum StatsTimeRange {
    TODAY = "today",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
    CUSTOM = "custom"
}
export declare class AdminStatsDto {
    range?: StatsTimeRange;
    startDate?: string;
    endDate?: string;
}
