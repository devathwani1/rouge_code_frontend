import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { AuthResult } from "./types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        register: builder.mutation<AuthResult, any>({
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
        verifyEmail: builder.query<AuthResult, string>({
            query: (token) => `accounts/verify-email/?token=${token}`,
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useVerifyEmailQuery } = authApi;
