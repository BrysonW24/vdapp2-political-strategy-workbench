export declare enum AnalysisType {
    SUMMARY = "SUMMARY",
    SENTIMENT = "SENTIMENT",
    KEY_POINTS = "KEY_POINTS",
    TREND = "TREND",
    RISK_ASSESSMENT = "RISK_ASSESSMENT",
    OPPORTUNITY = "OPPORTUNITY"
}
export declare enum Sentiment {
    POSITIVE = "POSITIVE",
    NEGATIVE = "NEGATIVE",
    NEUTRAL = "NEUTRAL",
    MIXED = "MIXED"
}
export declare class CreateAnalysisDto {
    articleId: string;
    analysisType: AnalysisType;
    summary: string;
    keyPoints: string[];
    sentiment: Sentiment;
    confidence: number;
    metadata?: Record<string, any>;
}
