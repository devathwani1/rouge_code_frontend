import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { ApiResponse, Difficulty } from "./types";

export const commonApi = createApi({
    reducerPath: "commonApi",
    baseQuery,
    endpoints: (builder) => ({
        getDifficulties: builder.query<Difficulty[], void>({
            query: () => "common/difficulties/",
            transformResponse: (response: ApiResponse<Difficulty[]>) => response.data,
        }),
    }),
});

export const { useGetDifficultiesQuery } = commonApi;
