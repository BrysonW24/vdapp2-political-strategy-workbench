export declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare enum StrategyStatus {
    DRAFT = "DRAFT",
    REVIEW = "REVIEW",
    APPROVED = "APPROVED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED"
}
export declare class CreateStrategyDto {
    title: string;
    description: string;
    priority?: Priority;
    status?: StrategyStatus;
    metrics?: Record<string, any>;
}
