import express, { Express, Request, Response } from "express";

import {
  Puppy,
  getAllPuppies,
  getPuppy,
  deletePuppy,
  createPuppy,
  updatePuppy,
} from "./DB";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded());

app.get("/api/puppies", (_req: Request, res: Response) => {
  const puppies = getAllPuppies();
  if (puppies) {
    return res.status(200).json(puppies);
  }
  return res.status(200).json("No puppies found");
});

app.get("/api/puppies/:id", (req: Request, res: Response) => {
  const reqPuppyId = req.params.id;
  const puppy = getPuppy(reqPuppyId!);
  if (puppy) {
    return res.status(200).json(puppy);
  }

  return res.status(200).json("Puppy not found");
});

app.post("/api/puppies", (req: Request, res: Response) => {
  if (req.body.breed && req.body.name && req.body.birthDate) {
    if (
      typeof req.body.breed !== "string" ||
      typeof req.body.name !== "string" ||
      typeof req.body.name !== "string"
    ) {
      return res
        .status(400)
        .json("Wrong type of data was sent. String type is required.");
    }
    const reqNewPuppy: Puppy = req.body;
    const createdPuppy = createPuppy(reqNewPuppy);
    return res.status(201).json(createdPuppy);
  }

  return res
    .status(400)
    .json("To creat a puppy we need to know breed, name, birthDate.");
});

app.put("/api/puppies/:id", (req: Request, res: Response) => {
  if (
    typeof req.body.breed !== "string" ||
    typeof req.body.name !== "string" ||
    typeof req.body.name !== "string"
  ) {
    return res
      .status(400)
      .json("Wrong type of data was sent. String type is required.");
  }
  const reqPuppyId = req.params.id;
  const puppy = getPuppy(reqPuppyId!);
  if (puppy) {
    const updatedPuppy = updatePuppy(req.body, puppy);
    return res.status(200).json(updatedPuppy);
  }

  return res.status(200).json("Puppy not found");
});

app.delete("/api/puppies/:id", (req: Request, res: Response) => {
  const reqPuppyId = req.params.id;
  const deleted: boolean = deletePuppy(reqPuppyId!);
  if (deleted === true) {
    return res.status(200).json("Puppy deleted");
  }

  return res.status(200).json("Puppy not found");
});

export default app;
