export type Puppy = {
  slug?: string;
  breed: string;
  name: string;
  birthDate: string;
};

export type UpdateReq = {
  breed?: string;
  name?: string;
  birthDate?: string;
};

export type DeleteOneMongoRes = {
  acknowledged: boolean;
  deletedCount: number;
};
