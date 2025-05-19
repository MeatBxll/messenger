import { Box, Button, Container, Fab, TextField } from "@mui/material";
import { MdArrowForwardIos } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { HiMiniGif } from "react-icons/hi2";
import { IoMdPhotos } from "react-icons/io";
import { FriendsTab } from "./components/FriendsTab/FriendsTab";

export const Home = () => {
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
        <FriendsTab />
        <Box
          sx={{
            backgroundColor: "#606368",
            height: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              bgcolor: "#3C4042",
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              padding: "0 2rem 0 2rem",
              alignItems: "center",
            }}
          >
            <h2>Other Users's name</h2>
            <Fab size="small" color="primary">
              <IoSettingsSharp />
            </Fab>
          </Box>
          <Box sx={{ width: "100%", flex: 10 }}></Box>
          <Box
            sx={{
              width: "100%",
              flex: 2,
              bgcolor: "#3C4042",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 2rem 0 2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "10rem",
              }}
            >
              <Button>
                <HiMiniGif size={"3rem"} />
              </Button>
              <Button>
                <IoMdPhotos size={"3rem"} />
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <TextField />
              <Fab size="small" color="primary">
                <MdArrowForwardIos />
              </Fab>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "10rem",
              }}
            ></Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
