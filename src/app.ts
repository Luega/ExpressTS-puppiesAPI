require("dotenv").config();
var cors = require("cors");
import express, { Express, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Puppy } from "./types";

import {
  getAllPuppies,
  getPuppy,
  createPuppy,
  updatePuppy,
  deletePuppy,
} from "./mongoDB";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/api/puppies", async (_req: Request, res: Response) => {
  const puppies = await getAllPuppies();
  if (puppies.length > 0) {
    return res.status(200).json(puppies);
  }
  return res.status(200).json("No puppies found");
});

app.get("/api/puppies/:slug", async (req: Request, res: Response) => {
  const reqPuppySlug = req.params.slug;
  const puppy = await getPuppy(reqPuppySlug!);
  if (puppy) {
    return res.status(200).json(puppy);
  }

  return res.status(200).json("Puppy not found");
});

app.post(
  "/api/puppies",
  [
    body("breed")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the breed")
      .custom((value: string) => /^[a-zA-Z\s]*$/.test(value))
      .withMessage("Digits and special characters are not allowed in the breed")
      .isString()
      .withMessage("Breed must to be a string")
      .exists()
      .withMessage("Breed is required")
      .notEmpty()
      .withMessage("Breed must include at least one character")
      .trim()
      .escape(),
    body("name")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the name")
      .custom((value: string) => /^[a-zA-Z\s]*$/.test(value))
      .withMessage("Digits and special characters are not allowed in the name")
      .isString()
      .withMessage("Name must to be a string")
      .exists()
      .withMessage("Name is required")
      .notEmpty()
      .withMessage("Name must include at least one character")
      .trim()
      .escape(),
    body("birthDate")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the birthDate")
      .custom((value: string) =>
        /^(?:2[0-9]{3})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$$/.test(
          value
        )
      )
      .withMessage("BirthDate must be written in this format YYYY-MM-DD.")
      .isString()
      .withMessage("BirthDate must to be a string")
      .exists()
      .withMessage("Name is required")
      .notEmpty()
      .withMessage("BirthDate must be written in this format YYYY-MM-DD.")
      .trim()
      .escape(),
  ],
  async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const reqNewPuppy: Puppy = req.body;
    const createdPuppy = await createPuppy(reqNewPuppy);

    return res
      .status(201)
      .location(
        `http://localhost:${process.env.PORT}/api/puppies/${createdPuppy.slug}`
      )
      .json(createdPuppy);
  }
);

app.put(
  "/api/puppies/:slug",
  [
    body("breed")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the breed")
      .custom((value: string) => /^[a-zA-Z\s]*$/.test(value))
      .withMessage("Digits and special characters are not allowed in the breed")
      .isString()
      .withMessage("Breed must to be a string")
      .notEmpty()
      .withMessage("Breed must include at least one character")
      .trim()
      .optional()
      .escape(),
    body("name")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the name")
      .custom((value: string) => /^[a-zA-Z\s]*$/.test(value))
      .withMessage("Digits and special characters are not allowed in the name")
      .isString()
      .withMessage("Name must to be a string")
      .notEmpty()
      .withMessage("Name must include at least one character")
      .trim()
      .optional()
      .escape(),
    body("birthDate")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the birthDate")
      .custom((value: string) =>
        /^(?:2[0-9]{3})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$$/.test(
          value
        )
      )
      .withMessage("BirthDate must be written in this format YYYY-MM-DD.")
      .isString()
      .withMessage("BirthDate must to be a string")
      .notEmpty()
      .withMessage("BirthDate must be written in this format YYYY-MM-DD.")
      .trim()
      .optional()
      .escape(),
  ],
  async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const reqPuppySlug = req.params.slug;
    const puppy = await getPuppy(reqPuppySlug!);
    if (puppy) {
      const updatedPuppy = await updatePuppy(req.body, puppy);

      return res
        .status(200)
        .location(
          `http://localhost:${process.env.PORT}/api/puppies/${updatedPuppy.slug}`
        )
        .json(updatedPuppy);
    }

    return res.status(200).json("Puppy not found");
  }
);

app.delete("/api/puppies/:slug", async (req: Request, res: Response) => {
  const reqPuppySlug = req.params.slug;
  const deleted: boolean = await deletePuppy(reqPuppySlug!);
  if (deleted === true) {
    return res.status(200).json("Puppy deleted");
  }

  return res.status(200).json("Puppy not found");
});

app.get("*", function (_req: Request, res: Response) {
  return res.status(404).json("ERROR 404 - NOT FOUND");
});

export default app;
