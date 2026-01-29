import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ProfileData {
    language?: string;
    difficulty?: string;
    lives: number;
    streak: number;
    max_streak: number;
    xp: number;
    level: number;
    is_rogue: boolean;
}

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/profiles/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileData, void>({
            query: () => "me/",
        }),
        updateProfile: builder.mutation<ProfileData, Partial<ProfileData>>({
            query: (data) => ({
                url: "me/",
                method: "PATCH",
                body: data,
            }),
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
