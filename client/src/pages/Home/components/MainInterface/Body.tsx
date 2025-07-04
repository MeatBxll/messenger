import { Box } from "@mui/material";
import type { User, UserPreview } from "../../../../types";
import { MyDash } from "./MyDash/MyDash";
import { MessagesWithUser } from "./MessagesWithUser/MessagesWIthUser";

interface BodyProps {
  user: User;
  otherUser: UserPreview;
  isMyDash: boolean;
}

export const Body = (props: BodyProps) => {
  const { user, otherUser, isMyDash } = props;
  return (
    <Box
      sx={{
        width: "100%",
        flex: 10,
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
      }}
    >
      {isMyDash ? (
        <MyDash user={user} />
      ) : (
        <MessagesWithUser userId={user.id} otherUser={otherUser} />
      )}
    </Box>
  );
};
