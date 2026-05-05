import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { challengesApi } from "./challengesApi";

export interface ProfileData {
    email?: string;
    /** Same as Django user.username; may differ from email (e.g. legacy accounts). */
    username?: string;
    language?: string;
    difficulty?: number;
    lives: number;
    streak: number;
    max_streak: number;
    level: number;
    is_rogue: boolean;
}

export interface DayResultEntry {
    day_number: number;
    success: boolean;
    closed_at: string | null;
}

export interface ProfileStatsData {
    email: string;
    username: string;
    language?: string;
    difficulty: string | null;
    lives: number;
    max_lives: number;
    streak: number;
    max_streak: number;
    challenge_day?: number;
    total_days: number;
    solved: number;
    total_questions: number;
    solved_percent: number;
    /** Successful plan items whose question is tagged easy / medium / hard */
    solved_easy: number;
    solved_medium: number;
    solved_hard: number;
    day_results?: DayResultEntry[];
}

export interface LeaderboardRow {
    rank: number;
    user_id: number;
    username: string;
    email: string;
    difficulty: string | null;
    level: number;
    streak: number;
    max_streak: number;
    challenge_day: number;
}

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery,
    tagTypes: ["Profile", "ProfileStats"],
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileData, void>({
            query: () => "profiles/me/",
            providesTags: ["Profile"],
        }),
        updateProfile: builder.mutation<ProfileData, Partial<ProfileData>>({
            query: (data) => ({
                url: "profiles/me/",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Profile", "ProfileStats"],
        }),
        getProfileStats: builder.query<ProfileStatsData, void>({
            query: () => "profiles/me/stats/",
            providesTags: ["ProfileStats"],
        }),
        getLeaderboard: builder.query<LeaderboardRow[], void>({
            query: () => "profiles/leaderboard/",
        }),
        resetRun: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "profiles/me/reset-run/",
                method: "POST",
            }),
            invalidatesTags: ["Profile", "ProfileStats"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(
                        challengesApi.util.invalidateTags(["Challenges", "RecentAttempts"])
                    );
                } catch {
                    /* mutation failed — do not clear challenge cache */
                }
            },
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetProfileStatsQuery,
    useGetLeaderboardQuery,
    useResetRunMutation,
} = profileApi;
