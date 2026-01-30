import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

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
    baseQuery,
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileData, void>({
            query: () => "profiles/me/",
        }),
        updateProfile: builder.mutation<ProfileData, Partial<ProfileData>>({
            query: (data) => ({
                url: "profiles/me/",
                method: "PATCH",
                body: data,
            }),
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
