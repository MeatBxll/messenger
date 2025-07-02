import { Avatar, Box, Button, Collapse, Fab } from "@mui/material";
import { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { FriendCard } from "./FriendCard/FriendCard";
import { TiPlus } from "react-icons/ti";
import type { User } from "../../../../types";
import { useGetFriendsQuery } from "../../../../api/apiRoutes/friendsApi";
import { pfpMap } from "../../../../components/pfp";

interface FriendsTabProps {
  user: User;
  whereTo: (id: number, name: string) => void;
}

export const FriendsTab = (props: FriendsTabProps) => {
  const { user, whereTo } = props;
  const [usersIn, setUsersIn] = useState(false);

  const { data, isLoading, isError } = useGetFriendsQuery();
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
            <Button
              onClick={() => whereTo(-1, user.name)}
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
              <Avatar
                variant="square"
                alt={pfpMap[0]}
                src={pfpMap[user.pfpIndex]}
                sx={{ height: "2.3rem", width: "2.3rem" }}
              />
              <h4 style={{ textWrap: "nowrap" }}>{user.name}</h4>
            </Button>
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
            {data.friends.length === 0 ? (
              <div
                style={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                }}
              >
                <h5
                  style={{
                    padding: ".5rem",
                    textAlign: "center",
                    backgroundColor: "#3C3F41",
                    borderRadius: ".5rem",
                  }}
                >
                  You have no friends dude get some . . .
                </h5>
              </div>
            ) : null}
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
