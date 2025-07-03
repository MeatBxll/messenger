import {
  Box,
  Fab,
  TextField,
  Avatar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { TiPlus } from "react-icons/ti";
import { useGetAllUsersQuery } from "../../../../../api/apiRoutes/userApi";
import { useSendFriendRequestMutation } from "../../../../../api/apiRoutes/friendsApi";
import { useState, useRef, useEffect } from "react";
import { pfpMap } from "../../../../../components/pfp";

export const AddFriends = () => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: users = [] } = useGetAllUsersQuery();
  const [sendRequest, { isLoading: isSending }] =
    useSendFriendRequestMutation();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search)
  );

  const handleSendRequest = async (id: number) => {
    try {
      await sendRequest(id).unwrap();
      console.log("Friend request sent");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const error = err as { data: { message?: string } };
        alert(error.data.message || "Failed to send request");
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    setShowTopShadow(!atTop);
    setShowBottomShadow(!atBottom);
  };

  useEffect(() => {
    if (scrollRef.current) handleScroll();
  }, [filteredUsers]);

  return (
    <Box
      sx={{
        flex: 2,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingLeft: "1rem",
      }}
    >
      <TextField
        label="Add Friend"
        size="small"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(e.target.value.trim().length > 0);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => search.trim() && setShowDropdown(true)}
        autoComplete="off"
        fullWidth
        sx={{ maxWidth: 300 }}
      />

      {showDropdown && (
        <Paper
          sx={{
            position: "absolute",
            bottom: "calc(100% + 0.5rem)",
            left: 0,
            width: "140%",
            maxWidth: 450,
            maxHeight: 260,
            zIndex: 10,
            p: 0,
            bgcolor: "rgba(40, 40, 40, 0.97)",
            borderRadius: ".5rem",
            overflow: "hidden",
            boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
          }}
        >
          {showTopShadow && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1rem",
                background:
                  "linear-gradient(to bottom, rgba(40,40,40,1), rgba(40,40,40,0))",
                zIndex: 1,
              }}
            />
          )}
          {showBottomShadow && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1rem",
                background:
                  "linear-gradient(to top, rgba(40,40,40,1), rgba(40,40,40,0))",
                zIndex: 1,
              }}
            />
          )}

          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
              maxHeight: 260,
              overflowY: "auto",
              p: 1,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {filteredUsers.length === 0 ? (
              <Box sx={{ color: "gray", textAlign: "center", mt: 2 }}>
                No users found
              </Box>
            ) : (
              filteredUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                    p: 1.2,
                    bgcolor: "#2e2e2e",
                    borderRadius: "0.5rem",
                    cursor: "default",
                    "&:hover": { bgcolor: "#444" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      overflow: "hidden",
                    }}
                  >
                    <Avatar
                      src={pfpMap[Number(user.pfpIndex)] || ""}
                      alt={user.name}
                      sx={{ width: 35, height: 35 }}
                      variant="square"
                    />

                    <span
                      style={{
                        color: "white",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "9rem",
                      }}
                    >
                      {user.name}
                    </span>
                  </Box>
                  <Fab
                    size="small"
                    color="primary"
                    sx={{
                      width: 30,
                      height: 30,
                      minHeight: 30,
                      boxShadow: "none",
                    }}
                    onClick={() => handleSendRequest(user.id)}
                    disabled={isSending}
                  >
                    {isSending ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <TiPlus style={{ fontSize: "1rem" }} />
                    )}
                  </Fab>
                </Box>
              ))
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};
