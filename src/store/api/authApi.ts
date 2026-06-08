import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { AuthResult } from "./types";

/** GET accounts/admin/users/ (staff only) */
export interface AdminUserRow {
    user_id: number;
    email: string;
    age: number | null;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_active: boolean;
    is_verified: boolean;
    date_joined: string | null;
    last_login: string | null;
    created_at: string | null;
    language: string | null;
    lives: number | null;
    streak: number | null;
    max_streak: number | null;
    challenge_day: number | null;
    difficulty: string | null;
}

export interface AdminUsersResponse {
    count: number;
    users: AdminUserRow[];
}

interface RegisterRequest {
    email: string;
    password: string;
    confirm_password: string;
    age: number;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    tagTypes: ["AdminUsers"],
    endpoints: (builder) => ({
        register: builder.mutation<AuthResult, RegisterRequest>({
            query: (userData) => ({
                url: "accounts/register/",
                method: "POST",
                body: userData,
            }),
        }),
        login: builder.mutation<AuthResult, any>({
            query: (credentials) => ({
                url: "accounts/login/",
                method: "POST",
                body: credentials,
            }),
        }),
        googleAuth: builder.mutation<AuthResult, { credential: string }>({
            query: (body) => ({
                url: "accounts/google/",
                method: "POST",
                body,
            }),
        }),
        verifyEmail: builder.query<AuthResult, string>({
            query: (token) => `accounts/verify-email/?token=${token}`,
        }),
        getAdminUsersList: builder.query<AdminUsersResponse, void>({
            query: () => "accounts/admin/users/",
            transformResponse: (response: { data?: AdminUsersResponse }) =>
                response?.data ?? { count: 0, users: [] },
            providesTags: ["AdminUsers"],
        }),
        passwordResetRequest: builder.mutation<
            { status?: boolean; message?: string },
            { email: string }
        >({
            query: (body) => ({
                url: "accounts/password-reset/",
                method: "POST",
                body,
            }),
        }),
        passwordResetConfirm: builder.mutation<
            { status?: boolean; message?: string },
            { uid: string; token: string; new_password: string; confirm_password: string }
        >({
            query: (body) => ({
                url: "accounts/password-reset/confirm/",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGoogleAuthMutation,
    useVerifyEmailQuery,
    useGetAdminUsersListQuery,
    usePasswordResetRequestMutation,
    usePasswordResetConfirmMutation,
} = authApi;
