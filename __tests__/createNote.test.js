const request = require("supertest");
const app = require("../app");
const Group = require("../models/group");
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("api/notes", () => {
  describe("create api/notes/", () => {
    beforeAll(() => {
      jwt.verify = jest.fn(() => ({ id: "a id" }));
      Group.findById = jest.fn(() => ({
        name: "name",
        summary: "summary",
        _id: "a id",
      }));
      Note.create = (data) => data;
    });

    it("sends an error message when the title is missing", async () => {
      const token = "Bearer token";
      const note = {
        groupId: "id 1",
        groupId: "a id",
        text: "text 1",
        latitude: 10,
        longitude: 10,
      };

      Note.find = jest.fn(() => []);
      const response = await request(app)
        .post("/api/notes")
        .set({ Authorization: token })
        .send(note)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({ message: "title is missing" });
    });
  });
});
