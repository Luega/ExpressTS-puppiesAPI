import request from "supertest";
import app from "./app";
import { Puppy } from "./DB";

describe("Puppies API", () => {
  let createdPuppyId: Puppy;

  beforeAll(async () => {
    const newPuppy = {
      breed: "Golden Retriever",
      name: "Buddy",
      birthDate: "2022-01-01",
    };
    const response = await request(app).post("/api/puppies").send(newPuppy);
    createdPuppyId = response.body.id;
  });

  describe("GET /api/puppies", () => {
    it("should return all puppies", async () => {
      const response = await request(app).get("/api/puppies");
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should return "No puppies found" if there are no puppies', async () => {
      jest.spyOn(require("./DB"), "getAllPuppies").mockReturnValue([]);
      const response = await request(app).get("/api/puppies");
      expect(response.status).toBe(200);
      expect(response.body).toBe("No puppies found");
    });
  });

  describe("GET /api/puppies/:id", () => {
    it("should return a specific puppy", async () => {
      const response = await request(app).get(`/api/puppies/${createdPuppyId}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should return "Puppy not found" if the puppy does not exist', async () => {
      jest.spyOn(require("./DB"), "getPuppy").mockReturnValue(undefined);
      const response = await request(app).get("/api/puppies/999");
      expect(response.status).toBe(200);
      expect(response.body).toBe("Puppy not found");
    });
  });

  describe("POST /api/puppies", () => {
    it("should create a new puppy", async () => {
      const newPuppy = {
        breed: "Labrador Retriever",
        name: "Max",
        birthDate: "2023-05-11",
      };
      const response = await request(app).post("/api/puppies").send(newPuppy);
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });

    it("should return validation errors if request body is invalid", async () => {
      const invalidPuppy = { breed: "", name: "   ", birthDate: "2023-05-11" };
      const response = await request(app)
        .post("/api/puppies")
        .send(invalidPuppy);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("PUT /api/puppies/:id", () => {
    it("should update an existing puppy", async () => {
      const updatedPuppy = { breed: "Labrador Retriever" };
      const response = await request(app)
        .put(`/api/puppies/${createdPuppyId}`)
        .send(updatedPuppy);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should return "Puppy not found" if the puppy does not exist', async () => {
      jest.spyOn(require("./DB"), "getPuppy").mockReturnValue(undefined);
      const updatedPuppy = { breed: "Labrador Retriever" };
      const response = await request(app)
        .put("/api/puppies/999")
        .send(updatedPuppy);
      expect(response.status).toBe(200);
      expect(response.body).toBe("Puppy not found");
    });

    it("should return validation errors if request body is invalid", async () => {
      const invalidPuppy = { breed: "", name: "   ", birthDate: "2021-01-01" };
      const response = await request(app)
        .put("/api/puppies/1")
        .send(invalidPuppy);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("DELETE /api/puppies/:id", () => {
    it("should delete an existing puppy", async () => {
      const response = await request(app).delete(
        `/api/puppies/${createdPuppyId}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toBe("Puppy deleted");
    });

    it('should return "Puppy not found" if the puppy does not exist', async () => {
      const response = await request(app).delete("/api/puppies/999");
      expect(response.status).toBe(200);
      expect(response.body).toBe("Puppy not found");
    });
  });
});
