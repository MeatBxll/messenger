import { useDispatch } from "react-redux";
import { setCredentials } from "../../../api/authSlice";
import type { AppDispatch } from "../../../api/store";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const GoogleLoginButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;

    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      "http://localhost:8000/api/auth/google",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:8000") return;

      const { accessToken, user } = event.data;

      if (accessToken && user) {
        dispatch(setCredentials({ accessToken, user }));
        console.log("Logged in via Google:", user);
        navigate("/home");
      }

      window.removeEventListener("message", receiveMessage);
    };

    window.addEventListener("message", receiveMessage);
  };

  return (
    <Button variant="contained" onClick={handleGoogleLogin}>
      Sign in with Google
    </Button>
  );
};
