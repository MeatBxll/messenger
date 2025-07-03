import type { GetMeResponse } from "../../types";
import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/user",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    signIn: builder.mutation({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSignInMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
