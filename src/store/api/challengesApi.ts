import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/challenges/" }),
    endpoints: (builder) => ({
        createQuestion: builder.mutation<any, QuestionData>({
            query: (data) => ({
                url: "questions/",
                method: "POST",
                body: data,
            }),
        }),
        listQuestions: builder.query<any, void>({
            query: () => "",
        }),
    }),
});

export const { useCreateQuestionMutation, useListQuestionsQuery } = challengesApi;
