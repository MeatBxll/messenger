import express, { Application } from "express";

const app: Application = express();
const PORT: number = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/test", (req: any, res: any) => {
  return res.json({
    msg: "hello world",
  });
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
