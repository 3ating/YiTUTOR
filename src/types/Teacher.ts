export interface Teacher {
    selectedTimes: { day: string; hours: number[] }[];
    uid: string;
    name: string;
    description?: string;
    avatar?: string;
    certification?: boolean;
    courses?: Record<string, any>;
    document?: string;
    email?: string;
    phone?: string;
    price?: { qty: number; price: number }[];
    subject?: string[];
    userType?: string;
    intro?: string;
    evaluation?: number[];
}
