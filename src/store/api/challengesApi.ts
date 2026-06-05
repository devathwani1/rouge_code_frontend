import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { DailyPlan, DailyPlanItem } from "./types";

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

export type SolveLanguage = "python" | "java" | "cpp";

/** From GET .../solve/ for the authenticated user; null if not logged in */
export type QuestionSolveStatus = "pending" | "failed" | "completed";

export interface QuestionData {
    id?: string;
    title: string;
    slug?: string;
    description: string;
    image_url?: string | null;
    constraints?: string;
    function_name: string;
    return_type: TypeSchema;
    difficulty: "easy" | "medium" | "hard";
    parameters: QuestionParameter[];
    test_cases: TestCase[];
    created_at?: string;
    starter_code?: string;
    language?: SolveLanguage;
    /** Present on solve endpoint; null when anonymous */
    solve_status?: QuestionSolveStatus | null;
}

export interface ProgressResponse {
    difficulty: "easy" | "medium" | "hard";
    completed_days: number;
    total_days: number;
}

/** Raw JSON from POST challenges/submit/ (not wrapped in ApiResponse) */
export interface SubmitSolutionResult {
    passed: number;
    total: number;
    success: boolean;
    /** One entry per public test case (same order as question test_cases in solve API) */
    case_results: boolean[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/** GET challenges/admin/questions/ */
export interface AdminQuestionsResponse {
    count: number;
    questions: QuestionData[];
}

/** GET challenges/admin/submissions/?limit= */
export interface AdminSubmissionRow {
    id: number;
    user_id: number;
    user_email: string;
    user_username: string;
    question_id: string;
    question_title: string;
    question_slug: string;
    question_difficulty: string;
    day_number: number;
    plan_difficulty: string | null;
    item_order: number;
    passed: number;
    total: number;
    success: boolean;
    last_submitted_at: string;
    created_at: string;
}

export interface AdminSubmissionsResponse {
    total_count: number;
    returned: number;
    submissions: AdminSubmissionRow[];
}

/** GET challenges/questions/recent/?q=N */
export interface RecentQuestionAttempt {
    question_id: string;
    title: string;
    slug: string;
    difficulty: string;
    last_attempted_at: string;
    last_success: boolean;
    last_passed: number;
    last_total: number;
}

export const challengesApi = createApi({
    reducerPath: "challengesApi",
    baseQuery,
    tagTypes: [
        "QuestionSolve",
        "RecentAttempts",
        "AdminQuestions",
        "AdminSubmissions",
        /** Daily plans / items — invalidated when a run reset wipes progress */
        "Challenges",
    ],
    endpoints: (builder) => ({
        createQuestion: builder.mutation<QuestionData, QuestionData | FormData>({
            query: (data) => ({
                url: "challenges/questions/",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: { data?: QuestionData }) =>
                response?.data as QuestionData,
            invalidatesTags: ["AdminQuestions"],
        }),
        getAdminQuestionsList: builder.query<AdminQuestionsResponse, void>({
            query: () => "challenges/admin/questions/",
            transformResponse: (response: { data?: AdminQuestionsResponse }) =>
                response?.data ?? { count: 0, questions: [] },
            providesTags: ["AdminQuestions"],
        }),
        getAdminSubmissionsList: builder.query<AdminSubmissionsResponse, void>({
            query: () => "challenges/admin/submissions/?limit=2000",
            transformResponse: (response: { data?: AdminSubmissionsResponse }) =>
                response?.data ?? {
                    total_count: 0,
                    returned: 0,
                    submissions: [],
                },
            providesTags: ["AdminSubmissions"],
        }),
        updateQuestion: builder.mutation<
            QuestionData,
            { id: string; body: QuestionData | FormData }
        >({
            query: ({ id, body }) => ({
                url: `challenges/questions/${id}/`,
                method: "PATCH",
                body,
            }),
            transformResponse: (response: { data?: QuestionData }) =>
                response?.data as QuestionData,
            invalidatesTags: ["AdminQuestions"],
        }),
        deleteQuestion: builder.mutation<void, string>({
            query: (id) => ({
                url: `challenges/questions/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["AdminQuestions"],
        }),
        getProgress: builder.query<ProgressResponse, string>({
            query: (difficulty) => `challenges/progress/?difficulty=${difficulty}`,
            transformResponse: (response: { data: ProgressResponse }) => response.data,
        }),
        getQuestionByDay: builder.query<ApiResponse<QuestionData>, { difficulty: string; day: number }>({
            query: ({ difficulty, day }) => `challenges/question/${difficulty}${day}`,
            transformResponse: (response: ApiResponse<QuestionData>) => response,
        }),
        submitSolution: builder.mutation<
            SubmitSolutionResult,
            { question_id: string; code: string; language?: SolveLanguage }
        >({
            query: (body) => ({
                url: "challenges/submit/",
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _err, arg) => [
                { type: "QuestionSolve", id: arg.question_id },
                { type: "RecentAttempts", id: "LIST" },
                "AdminSubmissions",
            ],
        }),
        getRecentQuestionAttempts: builder.query<RecentQuestionAttempt[], number>({
            query: (q) => `challenges/questions/recent/?q=${q}`,
            transformResponse: (response: {
                status?: boolean;
                data?: RecentQuestionAttempt[];
            }) => response.data ?? [],
            providesTags: [{ type: "RecentAttempts", id: "LIST" }],
        }),
        getDailyPlans: builder.query<DailyPlan[], void>({
            query: () => "challenges/daily-plans/",
            transformResponse: (response: { status: boolean; message: string; data: DailyPlan[] }) => response.data,
            providesTags: ["Challenges"],
        }),
        getDailyPlanItems: builder.query<DailyPlanItem[], string>({
            query: (planId) => `challenges/daily-plans/${planId}/items/`,
            transformResponse: (response: { status: boolean; message: string; data: DailyPlanItem[] }) => response.data,
            providesTags: ["Challenges"],
        }),
        getQuestionById: builder.query<QuestionData | undefined, string>({
            query: (id) => `challenges/questions/${id}/`,
            transformResponse: (response: { data?: QuestionData }) => response?.data,
        }),
        getQuestionSolveData: builder.query<ApiResponse<QuestionData>, string>({
            query: (id) => `challenges/questions/${id}/solve/`,
            transformResponse: (response: ApiResponse<QuestionData>) => response,
            providesTags: (_result, _err, id) => [{ type: "QuestionSolve", id }],
        }),
    }),
});

export const {
    useCreateQuestionMutation,
    useGetAdminQuestionsListQuery,
    useGetAdminSubmissionsListQuery,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
    useGetProgressQuery,
    useGetQuestionByDayQuery,
    useSubmitSolutionMutation,
    useGetDailyPlansQuery,
    useGetDailyPlanItemsQuery,
    useGetQuestionByIdQuery,
    useGetQuestionSolveDataQuery,
    useGetRecentQuestionAttemptsQuery,
} = challengesApi;
