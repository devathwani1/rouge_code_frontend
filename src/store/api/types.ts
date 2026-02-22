export interface AuthResult {
    success: boolean;
    auth_state: string;
    message?: string;
    action_required?: string;
    data?: any;
}

export const AuthState = {
    USER_NOT_FOUND: "USER_NOT_FOUND",
    WRONG_PASSWORD: "WRONG_PASSWORD",
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
    EMAIL_ALREADY_REGISTERED: "EMAIL_ALREADY_REGISTERED",
    SUCCESS: "SUCCESS",
    NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
    NOT_VERIFIED: "NOT_VERIFIED",
} as const;

export const ActionRequired = {
    VERIFY_EMAIL: "VERIFY_EMAIL",
    LOGIN: "LOGIN",
} as const;

export interface DailyPlanItem {
    id: string;
    title: string;
    difficulty: string;
    order: number;
}

export interface DailyPlan {
    id: string;
    day_number: number;
}

export interface Difficulty {
    id: number;
    name: string;
    mode_name: string;
    logo: string;
    days: number;
    number_of_questions: number;
}

export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}
