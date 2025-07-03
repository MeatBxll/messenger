import { Box, Button } from "@mui/material";
import { Notifications } from "./Notifications/Notifications";
import { useState } from "react";
import type { ReceivedRequest } from "../../../../types";

interface headerProps {
  text: string | undefined;
  recievedRequests: ReceivedRequest[];
}

export const Header = (props: headerProps) => {
  const { text, recievedRequests } = props;
  const [isNotify, setIsNotify] = useState(false);
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#3C4042",
        flex: 1,
        display: "flex",
        padding: "0 2rem 0 2rem",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <h2>{text === undefined ? "Welcome" : text}</h2>

      <Box>
        <Button onClick={() => setIsNotify(!isNotify)} variant="contained">
          Notifications
        </Button>
        {isNotify ? (
          <Notifications recievedRequests={recievedRequests} />
        ) : null}
      </Box>
    </Box>
  );
};
