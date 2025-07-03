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
    respondToRequest: builder.mutation<
      void,
      { requestId: number; action: "accept" | "reject" }
    >({
      query: ({ requestId, action }) => ({
        url: `/friend-requests/${requestId}/respond`,
        method: "POST",
        body: { action },
        credentials: "include",
      }),
      invalidatesTags: ["User", "FriendRequest"],
    }),
    sendFriendRequest: builder.mutation<{ message: string }, number>({
      query: (receiverId) => ({
        url: `/friend-requests/${receiverId}`,
        method: "POST",
      }),
      invalidatesTags: ["FriendRequest"],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useRespondToRequestMutation,
  useSendFriendRequestMutation,
} = authApi;
