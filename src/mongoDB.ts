require("dotenv").config();
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
import { Puppy, UpdateReq, DeleteOneMongoRes } from "./types";

export const mongoClient: typeof MongoClient = new MongoClient(
  `${process.env.CONNECTION_STRING_MONGODB}`
);

export const createSlug = (breed: string, name: string) => {
  let slug: string = `${breed.toLowerCase()}-${name.toLowerCase()}`;
  slug = slug.replace(/\s+/g, "-");
  const uniqueId = uuidv4();
  slug = `${slug}-${uniqueId}`;

  return slug;
};

// START - SEEDER - DELETE THIS SECTION IF YOU WANT TO WORK WITH YOUR DATA
const puppies: Puppy[] = [
  {
    breed: "Labrador Retriever",
    name: "Max",
    birthDate: "2023-07-15",
  },
  {
    breed: "Golden Retriever",
    name: "Bella",
    birthDate: "2023-06-10",
  },
  {
    breed: "French Bulldog",
    name: "Charlie",
    birthDate: "2023-07-02",
  },
  {
    breed: "Poodle",
    name: "Lucy",
    birthDate: "2023-05-20",
  },
  {
    breed: "Siberian Husky",
    name: "Rocky",
    birthDate: "2023-06-05",
  },
  {
    breed: "Beagle",
    name: "Lola",
    birthDate: "2023-07-01",
  },
  {
    breed: "Boxer",
    name: "Duke",
    birthDate: "2023-06-17",
  },
  {
    breed: "Bulldog",
    name: "Molly",
    birthDate: "2023-05-25",
  },
  {
    breed: "Pomeranian",
    name: "Teddy",
    birthDate: "2023-06-20",
  },
  {
    breed: "Rottweiler",
    name: "Coco",
    birthDate: "2023-06-12",
  },
  {
    breed: "Yorkshire Terrier",
    name: "Bentley",
    birthDate: "2023-05-30",
  },
  {
    breed: "Chihuahua",
    name: "Milo",
    birthDate: "2023-07-10",
  },
  {
    breed: "Dachshund",
    name: "Sophie",
    birthDate: "2023-06-15",
  },
  {
    breed: "Great Dane",
    name: "Luna",
    birthDate: "2023-05-22",
  },
  {
    breed: "Bull Terrier",
    name: "Oscar",
    birthDate: "2023-07-05",
  },
  {
    breed: "Border Collie",
    name: "Rosie",
    birthDate: "2023-06-25",
  },
  {
    breed: "Pug",
    name: "Bailey",
    birthDate: "2023-07-07",
  },
  {
    breed: "Shih Tzu",
    name: "Toby",
    birthDate: "2023-06-08",
  },
  {
    breed: "Australian Shepherd",
    name: "Mia",
    birthDate: "2023-05-18",
  },
  {
    breed: "Cavalier King Charles Spaniel",
    name: "Cooper",
    birthDate: "2023-07-03",
  },
];

const puppiesSeeder: Puppy[] = puppies.map((puppy) => ({
  slug: createSlug(puppy.breed, puppy.name),
  image: null,
  info: null,
  ...puppy,
}));

const uploadSeederData = async (seeder: Puppy[]) => {
  await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .deleteMany({});

  await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .insertMany(seeder);
};

uploadSeederData(puppiesSeeder);
// END - SEEDER

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
    image: puppy.image ? puppy.image : null,
    breed: puppy.breed,
    name: puppy.name,
    birthDate: puppy.birthDate,
    info: puppy.info ? puppy.info : null,
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

  if (!updateReq.info) {
    if (updateReq.info?.length === 0) {
      updateReq = {
        ...updateReq,
        info: null,
      };
    } else {
      updateReq = {
        ...updateReq,
        info: puppy.info,
      };
    }
  }

  await mongoClient
    .db(`${process.env.MONGODB_DB}`)
    .collection(`${process.env.MONGODB_COLLECTION}`)
    .updateOne(
      { slug: puppy.slug },
      {
        $set: {
          slug: newSlug,
          image: updateReq.image ? updateReq.image : puppy.image,
          breed: updateReq.breed ? updateReq.breed : puppy.breed,
          name: updateReq.name ? updateReq.name : puppy.name,
          birthDate: updateReq.birthDate
            ? updateReq.birthDate
            : puppy.birthDate,
          info: updateReq.info,
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
