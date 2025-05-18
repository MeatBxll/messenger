import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { useState } from "react";

export const SignIn = () => {
  const [signIn, setSignIn] = useState(true);
  return (
    <Container
      sx={{
        height: " 100vh",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Button
          onClick={() => setSignIn(!signIn)}
          variant={signIn ? "contained" : "outlined"}
          size="large"
        >
          Sign In
        </Button>
        <Button
          onClick={() => setSignIn(!signIn)}
          variant={!signIn ? "contained" : "outlined"}
          size="large"
        >
          Sign Up
        </Button>
      </Box>
      <Box
        sx={
          signIn
            ? {
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                paddingX: "7rem",
                paddingY: "5rem",
                borderRadius: "1rem",
                border: 1,
              }
            : { display: "none" }
        }
      >
        <TextField id="standard-basic" label="Email" variant="standard" />
        <TextField id="standard-basic" label="Password" variant="standard" />
        <Button>Sign In</Button>
      </Box>
      <Box
        sx={
          !signIn
            ? {
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                paddingX: "7rem",
                paddingY: "2rem",
                borderRadius: "1rem",
                border: 1,
              }
            : { display: "none" }
        }
      >
        <TextField id="standard-basic" label="Email" variant="standard" />
        <TextField id="standard-basic" label="Password" variant="standard" />
        <TextField
          id="standard-basic"
          label="Confirm Password"
          variant="standard"
        />
        <TextField id="standard-basic" label="First Name" variant="standard" />
        <TextField id="standard-basic" label="Last Name" variant="standard" />
        <Button>Sign In</Button>
      </Box>
      <Button sx={{ marginTop: "1rem" }} size="large" variant="outlined">
        Sign In With Google
      </Button>
    </Container>
  );
};
