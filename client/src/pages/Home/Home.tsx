import { Box, Button, Container, Fab, TextField } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { HiMiniGif } from "react-icons/hi2";
import { IoMdPhotos } from "react-icons/io";

export const Home = () => {
  const [usersIn, setUsersIn] = useState(false);

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
        <Box
          sx={{
            display: "flex",
            boxShadow: "7px 0px 29px 0px rgba(100, 100, 111, 0.2)",
          }}
        >
          <Collapse
            orientation="horizontal"
            in={usersIn}
            sx={{ display: "flex" }}
          >
            <Box
              sx={{
                backgroundColor: "#2e3031",
                width: 200,
                height: "100%",
              }}
            />
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
