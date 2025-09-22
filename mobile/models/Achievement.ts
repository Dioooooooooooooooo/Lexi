export interface Achievement {
    id: string;
    name: string;
    description: string;
    badge: string;
    createdAt: string;
}

export interface PupilAchievement {
    id: string;
    pupilId: string;
    achievementId: string;
    createdAt: string;
}
