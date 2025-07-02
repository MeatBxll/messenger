import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changPfp: builder.mutation({
      query: (pfpIndex) => ({
        url: `/user/pfp/${pfpIndex}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useChangPfpMutation } = authApi;
