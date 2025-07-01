import type { GetFriendsResponse } from "../../types";
import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<GetFriendsResponse, void>({
      query: () => ({
        url: "/user/friends",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetFriendsQuery } = authApi;
