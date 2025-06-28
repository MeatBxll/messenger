import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
    }),
    signIn: builder.mutation({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSignupMutation, useSignInMutation } = authApi;
