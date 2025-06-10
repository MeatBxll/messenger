import express from "express";
import userRoutes from "./routes/userRoutes";
import cors from "cors";

const app = express();

//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use("/api/users", userRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
