const { v4: uuidv4 } = require("uuid");

export type Puppy = {
  id?: string;
  breed: string;
  name: string;
  birthDate: string;
};

type UpdateReq = {
  breed?: string;
  name?: string;
  birthDate?: string;
};

let DB: Puppy[] = [
  {
    id: uuidv4(),
    breed: "Maltese",
    name: "Carlo",
    birthDate: "01-12-2021",
  },
  {
    id: uuidv4(),
    breed: "Pastore tedesco",
    name: "Gianni",
    birthDate: "05-22-2022",
  },
  {
    id: uuidv4(),
    breed: "Labrador",
    name: "Guglielmo",
    birthDate: "06-21-2019",
  },
  {
    id: uuidv4(),
    breed: "Golden retriever",
    name: "Roberto",
    birthDate: "08-02-2018",
  },
  {
    id: uuidv4(),
    breed: "Carlino",
    name: "Ugo",
    birthDate: "11-22-2011",
  },
];

export const getAllPuppies = () => {
  return DB;
};

export const getPuppy = (reqPuppyId: string) => {
  const puppy = DB.find((puppy) => puppy.id === reqPuppyId!);
  return puppy;
};

export const createPuppy = (puppy: Puppy) => {
  const newPuppy: Puppy = {
    id: uuidv4(),
    breed: puppy.breed,
    name: puppy.name,
    birthDate: puppy.birthDate,
  };

  DB.push(newPuppy);

  return newPuppy;
};

export const updatePuppy = (updateReq: UpdateReq, puppy: Puppy) => {
  const updatedPuppy: Puppy = {
    id: puppy.id,
    breed: updateReq.breed ? updateReq.breed : puppy.breed,
    name: updateReq.name ? updateReq.name : puppy.name,
    birthDate: updateReq.birthDate ? updateReq.birthDate : puppy.birthDate,
  };

  const index: number = DB.findIndex((e) => e.id === puppy.id);
  DB.splice(index, 1, updatedPuppy);

  return getPuppy(updatedPuppy.id!);
};

export const deletePuppy = (puppyId: string) => {
  const index: number = DB.findIndex((puppy) => puppy.id === puppyId);
  if (index === -1) {
    return false;
  }
  DB.splice(index, 1);

  return true;
};

export default DB;
