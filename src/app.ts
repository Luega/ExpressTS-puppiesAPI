import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/api/test", (_req: Request, res: Response) => {
  return res.status(200).json({ test: "is working as it should" });
});

export default app;
