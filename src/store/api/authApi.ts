import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthResult } from "./types";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/accounts/" }),
    endpoints: (builder) => ({
        register: builder.mutation<AuthResult, any>({
            query: (userData) => ({
                url: "register/",
                method: "POST",
                body: userData,
            }),
        }),
        login: builder.mutation<AuthResult, any>({
            query: (credentials) => ({
                url: "login/",
                method: "POST",
                body: credentials,
            }),
        }),
        verifyEmail: builder.query<AuthResult, string>({
            query: (token) => `verify-email/?token=${token}`,
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useVerifyEmailQuery } = authApi;
