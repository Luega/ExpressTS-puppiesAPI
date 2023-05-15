export type Puppy = {
  slug?: string;
  image?: string;
  breed: string;
  name: string;
  birthDate: string;
  info?: string;
};

export type UpdateReq = {
  image?: string;
  breed?: string;
  name?: string;
  birthDate?: string;
  info?: string;
};

export type DeleteOneMongoRes = {
  acknowledged: boolean;
  deletedCount: number;
};
