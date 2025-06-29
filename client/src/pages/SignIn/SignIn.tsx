import { useState } from "react";
import { Box, Button, Container } from "@mui/material";
import { SignInForm } from "./SignInComponents/SignInForm";
import { SignUpForm } from "./SignInComponents/SignUpForm";

export const SignIn = () => {
  const [signIn, setSignIn] = useState(true);

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      <Box>
        <Button
          onClick={() => setSignIn(true)}
          variant={signIn ? "contained" : "outlined"}
          size="large"
        >
          Sign In
        </Button>
        <Button
          onClick={() => setSignIn(false)}
          variant={!signIn ? "contained" : "outlined"}
          size="large"
        >
          Sign Up
        </Button>
      </Box>

      {signIn ? <SignInForm /> : <SignUpForm />}
    </Container>
  );
};
