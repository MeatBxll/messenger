import type { UserPreview } from "../../types";
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
    getAllUsers: builder.query<UserPreview[], void>({
      query: () => "/user",
    }),
  }),
});

export const { useChangPfpMutation, useGetAllUsersQuery } = authApi;
