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
        }),
    }),
});

export const { useCreateQuestionMutation, useListQuestionsQuery } = challengesApi;
