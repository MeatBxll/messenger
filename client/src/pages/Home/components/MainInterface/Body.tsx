import { Box } from "@mui/material";
import type { User } from "../../../../types";
import { MyDash } from "./MyDash/MyDash";

interface BodyProps {
  user: User;
}

export const Body = (props: BodyProps) => {
  const { user } = props;
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
      <MyDash user={user} />
    </Box>
  );
};
