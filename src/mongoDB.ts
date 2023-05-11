require("dotenv").config();
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
import { Puppy, UpdateReq, DeleteOneMongoRes } from "./types";

export const mongoClient: typeof MongoClient = new MongoClient(
  `${process.env.CONNECTION_STRING_MONGODB}`
);

const createSlug = (breed: string, name: string) => {
  let slug: string = `${breed.toLowerCase()}-${name.toLowerCase()}`;
  slug = slug.replace(/\s+/g, "-");
  const uniqueId = uuidv4();
  slug = `${slug}-${uniqueId}`;

  return slug;
};

export const getAllPuppies = async (): Promise<Puppy[]> => {
  const puppies: Puppy[] = await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .find()
    .toArray();

  return puppies;
};

export const getPuppy = async (puppySlug: string): Promise<Puppy> => {
  const puppy: Puppy = await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .findOne({ slug: puppySlug });

  return puppy;
};

export const createPuppy = async (puppy: Puppy): Promise<Puppy> => {
  const newPuppy: Puppy = {
    slug: createSlug(puppy.breed, puppy.name),
    breed: puppy.breed,
    name: puppy.name,
    birthDate: puppy.birthDate,
  };
  await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .insertOne(newPuppy);
  const createdPuppy: Puppy = await getPuppy(newPuppy.slug!);

  return createdPuppy;
};

export const updatePuppy = async (
  updateReq: UpdateReq,
  puppy: Puppy
): Promise<Puppy> => {
  const newSlug = createSlug(
    updateReq.breed ? updateReq.breed : puppy.breed,
    updateReq.name ? updateReq.name : puppy.name
  );
  await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .updateOne(
      { slug: puppy.slug },
      {
        $set: {
          slug: newSlug,
          breed: updateReq.breed ? updateReq.breed : puppy.breed,
          name: updateReq.name ? updateReq.name : puppy.name,
          birthDate: updateReq.birthDate
            ? updateReq.birthDate
            : puppy.birthDate,
        },
      }
    );
  const updatedPuppy: Puppy = await getPuppy(newSlug!);

  return updatedPuppy;
};

export const deletePuppy = async (puppySlug: string): Promise<boolean> => {
  const deletedPuppy: DeleteOneMongoRes = await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .deleteOne({ slug: puppySlug });

  return deletedPuppy.deletedCount > 0 ? true : false;
};
