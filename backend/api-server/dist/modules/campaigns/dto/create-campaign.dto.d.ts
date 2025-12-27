export declare enum CampaignStatus {
    PLANNING = "PLANNING",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED"
}
export declare class CreateCampaignDto {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    status?: CampaignStatus;
}
