import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home/Home";
import { SignIn } from "./pages/SignIn/SignIn";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark", // or "light"
      background: { default: "#202124", paper: "#212121" },
      primary: {
        main: "#DEDEF7",
      },
      secondary: {
        main: "#8788C7",
      },
    },
    typography: {
      fontFamily: "Roboto, Arial",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{" "}
      <Router>
        <Routes>
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
