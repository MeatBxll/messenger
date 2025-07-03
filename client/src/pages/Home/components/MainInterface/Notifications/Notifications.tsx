import { Box, Button, Avatar } from "@mui/material";
import type { ReceivedRequest } from "../../../../../types";
import { pfpMap } from "../../../../../components/pfp";
import { useRespondToRequestMutation } from "../../../../../api/apiRoutes/friendsApi";

interface NotificationsProps {
  recievedRequests: ReceivedRequest[];
}

export const Notifications = ({ recievedRequests }: NotificationsProps) => {
  const [respondToRequest] = useRespondToRequestMutation();

  const handleRespond = async (id: number, action: "accept" | "reject") => {
    try {
      await respondToRequest({ requestId: id, action }).unwrap();
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        width: "20rem",
        height: "30rem",
        backgroundColor: "rgba(40, 40, 40, 0.99)",
        transform: "translate(-11rem,1rem)",
        zIndex: 3,
        borderRadius: ".5rem",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      {recievedRequests.length === 0 ? (
        <Box sx={{ color: "gray", textAlign: "center", mt: 5 }}>
          No pending notifications
        </Box>
      ) : (
        recievedRequests.map((req) => (
          <Box
            key={req.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#2e2e2e",
              padding: "0.5rem 1rem",
              borderRadius: ".5rem",
              marginBottom: "0.75rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Avatar
                src={pfpMap[req.sender.pfpIndex]}
                alt={req.sender.name}
                sx={{ width: 40, height: 40 }}
              />
              <span style={{ color: "white" }}>{req.sender.name}</span>
            </Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleRespond(req.id, "accept")}
              >
                Accept
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleRespond(req.id, "reject")}
              >
                Reject
              </Button>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};
