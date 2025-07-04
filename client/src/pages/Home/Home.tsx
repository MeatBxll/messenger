import { Box, Container, Skeleton } from "@mui/material";
import { FriendsTab } from "./components/FriendsTab/FriendsTab";
import { useGetMeQuery } from "../../api/apiRoutes/authApi";
import { Header } from "./components/MainInterface/Header";
import { Body } from "./components/MainInterface/Body";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { UserPreview } from "../../types";

export const Home = () => {
  const { data, isLoading, isError, error } = useGetMeQuery();
  const [isMyDash, setIsMyDash] = useState(true);
  const [headerName, setHeaderName] = useState<string | undefined>(
    data?.user.name
  );
  const navigate = useNavigate();

  const [otherUser, setOtherUser] = useState<UserPreview>({
    id: -1,
    name: "placeHolder",
    email: "//",
    pfpIndex: 0,
  });

  useEffect(() => {
    if (data?.user?.name) {
      setHeaderName(data.user.name);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function isApiError(err: any): err is { data: { message?: string } } {
        return (
          typeof err === "object" &&
          err !== null &&
          "data" in err &&
          typeof err.data === "object" &&
          err.data !== null &&
          "message" in err.data
        );
      }

      const message =
        isApiError(error) && error.data.message
          ? error.data.message
          : "Unknown error occurred";

      alert(`Error: ${message}`);
      navigate("/", { replace: true });
    }
  }, [isError, error, navigate]);

  const determineBlock = (friend: UserPreview, isDash: boolean) => {
    setIsMyDash(isDash);
    setHeaderName(friend.name);
    setOtherUser(friend);
  };

  if (isLoading)
    return (
      <Container
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            height: "80vh",
            width: "100%",
            maxWidth: 1200,
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ width: 220, height: "100%", borderRadius: 0 }}
          />

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              bgcolor: "#e0e0e0",
              borderRadius: 0,
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={60}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{ flexGrow: 1, borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              height={50}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Box>
      </Container>
    );

  if (!data || !data.user) return null;

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        userSelect: "none",
        px: 2,
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
          borderRadius: 3,
          overflow: "hidden",
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
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            boxShadow: "inset 0 0 10px rgb(0 0 0 / 0.15)",
          }}
        >
          <Header
            recievedRequests={data.user.receivedRequests}
            text={headerName}
          />

          <Body isMyDash={isMyDash} otherUser={otherUser} user={data.user} />
        </Box>
      </Box>
    </Container>
  );
};
