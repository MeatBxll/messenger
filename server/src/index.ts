import express, { Application } from "express";
import "./prisma/prisma";
import prismaInstance from "./prisma/prisma";
import userRoutes from "./routes/userRoutes";

const prisma = prismaInstance;
const app: Application = express();
const PORT: number = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get("/api/test", (req: any, res: any) => {
  return res.json({
    msg: "hello world",
  });
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
