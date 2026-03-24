export interface AssistanceItem {
    id: number;
    status: 'PRESENT' | 'MISSING' | 'LAG' | 'JUSTIFY';
    session: {
        date: string;
        schedule: {
            startTime: string;
            teacherAssignment: {
                subject: {
                    name: string;
                }
            }
        }
    }
}

export interface AssistanceResponse {
    success: boolean;
    data: AssistanceItem[];
    count: number;
}
