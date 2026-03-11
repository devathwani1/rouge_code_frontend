import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { DailyPlan, DailyPlanItem, ApiResponse as GenericApiResponse } from "./types";

export type TypeKind = "primitive" | "array" | "map";
export type PrimitiveName = "int" | "bool" | "string";

export interface TypeSchema {
    kind: TypeKind;
    name?: PrimitiveName; // for primitive
    of?: TypeSchema;      // for array
    key?: TypeSchema;     // for map
    value?: TypeSchema;   // for map
}

export interface QuestionParameter {
    name: string;
    order: number;
    type_schema: TypeSchema;
}

export interface TestCase {
    input_data: any[];
    expected_output: any;
    is_hidden: boolean;
}

export interface QuestionData {
    id?: string;
    title: string;
    slug?: string;
    description: string;
    constraints?: string;
    function_name: string;
    return_type: TypeSchema;
    difficulty: "easy" | "medium" | "hard";
    parameters: QuestionParameter[];
    test_cases: TestCase[];
    created_at?: string;
    starter_code?: string;
}

export interface ProgressResponse {
    difficulty: "easy" | "medium" | "hard";
    completed_days: number;
    total_days: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const challengesApi = createApi({
    reducerPath: "challengesApi",
    baseQuery,
    endpoints: (builder) => ({
        createQuestion: builder.mutation<any, QuestionData>({
            query: (data) => ({
                url: "challenges/questions/",
                method: "POST",
                body: data,
            }),
        }),
        listQuestions: builder.query<any, void>({
            query: () => "challenges/",
            transformResponse: (response: { data: any }) => response.data,
        }),
        getProgress: builder.query<ProgressResponse, string>({
            query: (difficulty) => `challenges/progress/?difficulty=${difficulty}`,
            transformResponse: (response: { data: ProgressResponse }) => response.data,
        }),
        getQuestionByDay: builder.query<ApiResponse<QuestionData>, { difficulty: string; day: number }>({
            query: ({ difficulty, day }) => `challenges/question/${difficulty}${day}`,
            transformResponse: (response: ApiResponse<QuestionData>) => response,
        }),
        submitSolution: builder.mutation<any, { question_id: string; code: string }>({
            query: (body) => ({
                url: "challenges/submit/",
                method: "POST",
                body,
            }),
        }),
        getDailyPlans: builder.query<DailyPlan[], void>({
            query: () => "challenges/daily-plans/",
            transformResponse: (response: { status: boolean; message: string; data: DailyPlan[] }) => response.data,
        }),
        getDailyPlanItems: builder.query<DailyPlanItem[], string>({
            query: (planId) => `challenges/daily-plans/${planId}/items/`,
            transformResponse: (response: { status: boolean; message: string; data: DailyPlanItem[] }) => response.data,
        }),
        getQuestionById: builder.query<ApiResponse<QuestionData>, string>({
            query: (id) => `challenges/questions/${id}/`,
            transformResponse: (response: ApiResponse<QuestionData>) => response,
        }),
        getQuestionSolveData: builder.query<ApiResponse<QuestionData>, string>({
            query: (id) => `challenges/questions/${id}/solve/`,
            transformResponse: (response: ApiResponse<QuestionData>) => response,
        }),
    }),
});

export const { useCreateQuestionMutation, useListQuestionsQuery, useGetProgressQuery, useGetQuestionByDayQuery, useSubmitSolutionMutation, useGetDailyPlansQuery, useGetDailyPlanItemsQuery, useGetQuestionByIdQuery, useGetQuestionSolveDataQuery } = challengesApi;
