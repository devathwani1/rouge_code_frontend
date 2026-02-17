import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
        const data = result.error.data as any;

        if (result.error.status === 401) {
            // Handle token expiration or invalidity
            localStorage.removeItem("token");
            // Only redirect if not already on signin or signup
            if (!window.location.pathname.includes("/signin") && !window.location.pathname.includes("/signup")) {
                window.location.href = "/signin";
            }
        } else if (result.error.status === 403) {
            if (data?.auth_state === "NOT_VERIFIED") {
                toast.error(data.message || "Please verify your email.");
                if (!window.location.pathname.includes("/verifyEmail")) {
                    window.location.href = "/verifyEmail";
                }
            }
        }
    }

    return result;
};
