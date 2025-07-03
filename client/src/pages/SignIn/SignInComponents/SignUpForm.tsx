import { Box, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useSignupMutation } from "../../../api/apiRoutes/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, logout as logoutAction } from "../../../api/authSlice";
import { apiSlice } from "../../../api/apiSlice";

export const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [feedback, setFeedback] = useState("");

  const [signup, { data, isSuccess, isLoading }] = useSignupMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFeedback("❌ Passwords do not match");
      return;
    }

    try {
      dispatch(logoutAction());
      dispatch(apiSlice.util.resetApiState());

      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      setFeedback("✅ Account created successfully!");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorData = err as { data: { message?: string } };
        setFeedback(errorData.data.message || "❌ Unknown error");
      } else {
        setFeedback("❌ Unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (isSuccess && data?.accessToken) {
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          user: data.user,
        })
      );

      setTimeout(() => {
        navigate("/home");
      }, 50);
    }
  }, [isSuccess, data, dispatch, navigate]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        paddingX: "7rem",
        paddingY: "2rem",
        borderRadius: "1rem",
        border: 1,
      }}
    >
      {feedback && <h3>{feedback}</h3>}

      <TextField
        name="name"
        label="Name"
        variant="standard"
        autoComplete="off"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        name="email"
        label="Email"
        variant="standard"
        autoComplete="off"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        variant="standard"
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
      />
      <TextField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        variant="standard"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Sign Up"}
      </Button>
    </Box>
  );
};
