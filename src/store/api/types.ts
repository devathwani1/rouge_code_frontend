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
} as const;

export const ActionRequired = {
    VERIFY_EMAIL: "VERIFY_EMAIL",
    LOGIN: "LOGIN",
} as const;
