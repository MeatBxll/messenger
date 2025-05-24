import { Avatar, Box, Collapse, Fab } from "@mui/material";
import { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { FriendCard } from "./FriendCard/FriendCard";
import { TiPlus } from "react-icons/ti";

export const FriendsTab = () => {
  const [usersIn, setUsersIn] = useState(false);
  const [friends, setFriends] = useState([
    "Tim",
    "Thomas",
    "Jimmy",
    "Steve",
    "Frank",
    "Nick",
    "Josh",
    "Ashly",
    "Beth",
    "Anna",
    "Jen",
    "Sam",
    "Chris",
    "Adam",
  ]);

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
            width: 200,
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
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Fab size="small" color="secondary">
                <MdArrowForwardIos />
              </Fab>
              <h3>Anthony</h3>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 15,
              width: "100%",
              overflowY: "scroll",
              scrollbarWidth: "none",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexDirection: "column",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {friends.map((n, index) => (
              <FriendCard
                key={index}
                pfp={<Avatar alt={n} src="/static/images/avatar/1.jpg" />}
                name={n}
              />
            ))}
          </Box>
          <Box
            sx={{
              flex: 2,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <h3>Add Friend</h3>
            <Fab size="small" color="primary">
              <TiPlus />
            </Fab>
          </Box>
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
