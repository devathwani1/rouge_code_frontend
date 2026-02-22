import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./api/authApi";
import { challengesApi } from "./api/challengesApi";
import { profileApi } from "./api/profileApi";
import { commonApi } from "./api/commonApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [challengesApi.reducerPath]: challengesApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [commonApi.reducerPath]: commonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            challengesApi.middleware,
            profileApi.middleware,
            commonApi.middleware
        ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
