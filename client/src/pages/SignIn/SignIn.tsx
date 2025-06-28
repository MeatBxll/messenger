import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { useState } from "react";
import { useSignupMutation } from "../../api/authApi/authApi";

export const SignIn = () => {
  const [signIn, setSignIn] = useState(true);

  interface ApiError {
    data?: {
      message?: string;
    };
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signup, { isLoading, isSuccess, isError, error }] =
    useSignupMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFeedback("Passwords do not match");
      return;
    }

    try {
      await signup(formData).unwrap();
      setFeedback("✅ Account created successfully!");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorData = err as { data: { message?: string } };
        setFeedback(errorData.data.message || "Unknown error occurred");
      } else {
        setFeedback("Unexpected error occurred");
      }
    }
  };

  if (isLoading) return <div>Loading . . . </div>;

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
        <TextField id="email" label="Email" variant="standard" />
        <TextField id="password" label="Password" variant="standard" />
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
        <Box>
          {feedback && <h3>{feedback}</h3>}

          {isError && (
            <div style={{ color: "red" }}>
              {(error as ApiError)?.data?.message || "Error occurred"}
            </div>
          )}

          {isSuccess && (
            <div style={{ color: "green" }}>Account created successfully!</div>
          )}
        </Box>
        <TextField
          name="name"
          id="name"
          label="Name"
          variant="standard"
          onChange={handleChange}
          value={formData.name}
        />
        <TextField
          name="email"
          id="email"
          label="Email"
          variant="standard"
          onChange={handleChange}
          value={formData.email}
        />
        <TextField
          name="password"
          id="password"
          label="Password"
          variant="standard"
          onChange={handleChange}
          value={formData.password}
        />
        <TextField
          name="confirmPassword"
          id="confirmPassword"
          label="Confirm Password"
          variant="standard"
          onChange={handleChange}
          value={formData.confirmPassword}
        />
        <Button onClick={handleSubmit}>Sign Up</Button>
      </Box>
    </Container>
  );
};
