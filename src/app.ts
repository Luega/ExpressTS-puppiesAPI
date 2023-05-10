import express, { Express, Request, Response } from "express";
import { body, validationResult } from "express-validator";

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

app.post(
  "/api/puppies",
  [
    body("breed")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the breed")
      .custom((value: string) => !/[\d\W]/.test(value))
      .withMessage("Digits and special characters are not allowed in the breed")
      .isString()
      .withMessage("Breed must to be a string")
      .exists()
      .withMessage("Breed is required")
      .notEmpty()
      .withMessage("Breed must include at least one character")
      .trim(),
    body("name")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the name")
      .custom((value: string) => !/[\d\W]/.test(value))
      .withMessage("Digits and special characters are not allowed in the name")
      .isString()
      .withMessage("Name must to be a string")
      .exists()
      .withMessage("Name is required")
      .notEmpty()
      .withMessage("Name must include at least one character")
      .trim(),
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
      .trim(),
  ],
  (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const reqNewPuppy: Puppy = req.body;
    const createdPuppy = createPuppy(reqNewPuppy);

    return res.status(201).json(createdPuppy);
  }
);

app.put(
  "/api/puppies/:id",
  [
    body("breed")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the breed")
      .custom((value: string) => !/[\d\W]/.test(value))
      .withMessage("Digits and special characters are not allowed in the breed")
      .isString()
      .withMessage("Breed must to be a string")
      .notEmpty()
      .withMessage("Breed must include at least one character")
      .trim()
      .optional(),
    body("name")
      .custom((value: string) => !/^\s*$/.test(value))
      .withMessage("Only spaces are not allowed in the name")
      .custom((value: string) => !/[\d\W]/.test(value))
      .withMessage("Digits and special characters are not allowed in the name")
      .isString()
      .withMessage("Name must to be a string")
      .notEmpty()
      .withMessage("Name must include at least one character")
      .trim()
      .optional(),
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
      .optional(),
  ],
  (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const reqPuppyId = req.params.id;
    const puppy = getPuppy(reqPuppyId!);
    if (puppy) {
      const updatedPuppy = updatePuppy(req.body, puppy);

      return res.status(200).json(updatedPuppy);
    }

    return res.status(200).json("Puppy not found");
  }
);

app.delete("/api/puppies/:id", (req: Request, res: Response) => {
  const reqPuppyId = req.params.id;
  const deleted: boolean = deletePuppy(reqPuppyId!);
  if (deleted === true) {
    return res.status(200).json("Puppy deleted");
  }

  return res.status(200).json("Puppy not found");
});

export default app;
