// src/pages/SignIn/SignInComponents/SignInForm.tsx
import { Box, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useSignInMutation } from "../../../api/authApi/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../api/authSlice";

export const SignInForm = () => {
  interface ApiError {
    data?: {
      message?: string;
    };
  }

  function isApiError(err: unknown): err is ApiError {
    if (typeof err !== "object" || err === null) return false;
    const e = err as Record<string, unknown>;
    if (!("data" in e)) return false;
    const d = e.data as Record<string, unknown> | undefined;
    return typeof d?.message === "string";
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [feedback, setFeedback] = useState("");

  const [signIn, { data, isSuccess }] = useSignInMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFeedback("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(formData).unwrap();
      setFeedback("✅ Signed in successfully!");
    } catch (err: unknown) {
      let msg = "Unexpected error occurred";

      if (isApiError(err)) {
        msg = err.data!.message! || msg;
      }

      setFeedback(`❌ ${msg}`);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          user: data.user,
        })
      );
      navigate("/home");
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
        paddingY: "5rem",
        borderRadius: "1rem",
        border: 1,
      }}
    >
      {feedback && (
        <h3 style={{ color: feedback.startsWith("✅") ? "green" : "red" }}>
          {feedback}
        </h3>
      )}

      <TextField
        name="email"
        label="Email"
        variant="standard"
        onChange={handleChange}
        value={formData.email}
        autoComplete="email"
      />
      <TextField
        name="password"
        label="Password"
        variant="standard"
        type="password"
        onChange={handleChange}
        value={formData.password}
        autoComplete="current-password"
      />
      <Button type="submit" variant="contained">
        Sign In
      </Button>
    </Box>
  );
};
