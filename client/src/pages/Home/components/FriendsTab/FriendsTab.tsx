import { Avatar, Box, Button, Collapse, Fab } from "@mui/material";
import { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { FriendCard } from "./FriendCard/FriendCard";
import type { User } from "../../../../types";
import { useGetFriendsQuery } from "../../../../api/apiRoutes/friendsApi";
import { pfpMap } from "../../../../components/pfp";
import { AddFriends } from "./AddFriends/AddFriends";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../../../api/authSlice";
import { useLogoutMutation } from "../../../../api/apiRoutes/authApi";
import { useNavigate } from "react-router-dom";
import { apiSlice } from "../../../../api/apiSlice";

interface FriendsTabProps {
  user: User;
  whereTo: (id: number, name: string) => void;
}

export const FriendsTab = (props: FriendsTabProps) => {
  const { user, whereTo } = props;
  const [usersIn, setUsersIn] = useState(false);
  const { data, isLoading, isError } = useGetFriendsQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [triggerLogout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logoutAction());
      dispatch(apiSlice.util.resetApiState()); // Clear all RTK Query cache
      navigate("/");
    }
  };

  if (isLoading) return <div>loading friends . . .</div>;
  if (isError || !data || !data.friends)
    return <div>Error when loading friends</div>;

  const friends = data.friends;

  return (
    <Box
      sx={{
        display: "flex",
        boxShadow: "7px 0px 29px 0px rgba(100, 100, 111, 0.2)",
      }}
    >
      <Collapse orientation="horizontal" in={usersIn} sx={{ display: "flex" }}>
        <Box
          sx={{
            backgroundColor: "#2e3031",
            width: 240, // increased width for better spacing
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: 2,
              width: "100%",
              padding: ".5rem",
              display: "flex",
            }}
          >
            <Box
              sx={{
                bgcolor: "#3c3f41",
                flex: 1,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Button
                sx={{
                  flex: 1,
                  display: "flex",
                  gap: "0.75rem",
                  overflow: "hidden",
                  textTransform: "none",
                }}
                onClick={() => whereTo(-1, user.name)}
              >
                <Avatar
                  variant="square"
                  alt={pfpMap[0]}
                  src={pfpMap[user.pfpIndex]}
                  sx={{ height: "2.3rem", width: "2.3rem" }}
                />
                <h4
                  style={{
                    textWrap: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "6rem",
                    margin: 0,
                  }}
                >
                  {user.name}
                </h4>
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  minWidth: 0,
                  px: 1,
                  "&:hover": {
                    bgcolor: "#b71c1c",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 15,
              width: "100%",
              overflowY: "auto",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexDirection: "column",
              paddingX: 1,
              paddingY: 1,
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
            }}
          >
            {friends.map((n, index) => (
              <FriendCard
                whereTo={() => whereTo(n.id, n.name)}
                key={index}
                pfp={
                  <Avatar
                    variant="square"
                    alt={pfpMap[0]}
                    src={pfpMap[n.pfpIndex]}
                  />
                }
                name={n.name}
              />
            ))}
            {friends.length === 0 && (
              <Box
                sx={{
                  px: 2,
                }}
              >
                <h5
                  style={{
                    padding: ".5rem",
                    textAlign: "center",
                    backgroundColor: "#3C3F41",
                    borderRadius: ".5rem",
                    margin: 0,
                  }}
                >
                  You have no friends dude get some . . .
                </h5>
              </Box>
            )}
          </Box>
          <AddFriends />
        </Box>
      </Collapse>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#2e3031",
          padding: 2,
        }}
      >
        <Fab
          sx={{ position: "absolute", transform: "translateX(-0.5rem)" }}
          size="medium"
          color="secondary"
          onClick={() => setUsersIn(!usersIn)}
        >
          <MdArrowForwardIos />
        </Fab>
      </Box>
    </Box>
  );
};
