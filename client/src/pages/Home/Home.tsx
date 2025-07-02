import { Box, Container } from "@mui/material";
import { FriendsTab } from "./components/FriendsTab/FriendsTab";
import { useGetMeQuery } from "../../api/apiRoutes/authApi";
import { Header } from "./components/MainInterface/Header";
import { Body } from "./components/MainInterface/Body";
import { Footer } from "./components/MainInterface/Footer";
import { useState } from "react";

export const Home = () => {
  const { data, isLoading, isError } = useGetMeQuery();
  const [isMyDash, setIsMyDash] = useState(true);
  const [headerName, setHeaderName] = useState(data?.user.name);

  if (isLoading) return <div>Loading . . .</div>;
  if (isError || !data || !data.user)
    return <div>Something went wrong . . .</div>;

  const determineBlock = (friendId: number, friendName: string) => {
    setIsMyDash(friendId === -1);
    setHeaderName(friendName);
  };

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          height: "80vh",
          width: "100%",
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
        }}
      >
        <FriendsTab whereTo={determineBlock} user={data.user} />
        <Box
          sx={{
            backgroundColor: "#606368",
            height: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header text={headerName} />

          <Body user={data.user} />

          <Footer isNeeded={!isMyDash} />
        </Box>
      </Box>
    </Container>
  );
};
