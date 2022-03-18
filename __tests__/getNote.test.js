const request = require("supertest");
const app = require("../app");
const Group = require("../models/group");
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("api/notes", () => {
  describe("get api/notes/", () => {
    it("sends an empty array when no notes belong to group", async () => {
      const token = "Bearer token";
      jwt.verify = jest.fn(() => ({ id: "a id" }));
      Group.findById = jest.fn(() => ({
        name: "name",
        summary: "summary",
        _id: "a id",
      }));
      Note.find = jest.fn(() => []);
      const response = await request(app)
        .get("/api/notes")
        .set({ Authorization: token })
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ notes: [], total: 0 });
    });

    it("sends an array of notes when notes belong to the group", async () => {
      const token = "Bearer token";
      jwt.verify = jest.fn(() => ({ id: "a id" }));
      Group.findById = jest.fn(() => ({
        name: "name",
        summary: "summary",
        _id: "a id",
      }));

      const notes = [
        {
          title: "title 1",
          id: "id 1",
          groupId: "a id",
          text: "text 1",
          latitude: 10,
          longitude: 10,
        },
        {
          title: "title 2",
          id: "id 2",
          groupId: "a id",
          text: "text 2",
          latitude: 20,
          longitude: 20,
        },
      ];
      Note.find = jest.fn(() => notes);
      const response = await request(app)
        .get("/api/notes")
        .set({ Authorization: token })
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ notes, total: 2 });
    });
  });
});
