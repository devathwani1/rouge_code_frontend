import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export interface QuestionParameter {
    name: string;
    type: string;
}

export interface InputItem {
    name: string;
    value: any;
}

export interface TestCase {
    input: InputItem[];
    output: any;
}

export interface QuestionData {
    title: string;
    description: string;
    function_name: string;
    parameters: QuestionParameter[];
    return_type: string;
    test_cases: TestCase[];
    difficulty: "easy" | "medium" | "hard";
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
        submitSolution: builder.mutation<any, { question_id: number; code: string }>({
            query: (body) => ({
                url: "challenges/submit/",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useCreateQuestionMutation, useListQuestionsQuery, useGetProgressQuery, useGetQuestionByDayQuery, useSubmitSolutionMutation } = challengesApi;
