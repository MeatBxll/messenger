import type { Message, UserPreview } from "../../types";
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
    getMessagesWithUser: builder.query<Message[], number>({
      query: (otherUserId) => `/message/with/user/${otherUserId}`,
    }),
    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/message",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useChangPfpMutation,
  useGetAllUsersQuery,
  useGetMessagesWithUserQuery,
  useSendMessageMutation,
} = authApi;
