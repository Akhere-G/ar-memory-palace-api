const request = require("supertest");
const app = require("../app");
const Group = require("../models/group");
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("api/notes", () => {
  describe("delete api/notes/123", () => {
    beforeAll(() => {
      jwt.verify = jest.fn(() => ({ id: "a id" }));
      Group.findById = jest.fn(() => ({
        name: "name",
        summary: "summary",
        _id: "a id",
      }));
      Note.create = (data) => data;
    });

    it("sends an error message when no note has that id", async () => {
      const token = "Bearer token";

      Note.findByIdAndDelete = jest.fn(() => null);
      const response = await request(app)
        .delete("/api/notes/123")
        .set({ Authorization: token })
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        message: "This note doesn't exist",
      });
    });

    it("sends deleted note after successful deletion", async () => {
      const token = "Bearer token";

      Note.findByIdAndDelete = jest.fn(() => ({
        groupId: "a id",
        _id: "123",
        title: "title",
        text: "text",
        latitude: 10,
        longitude: 10,
      }));
      const response = await request(app)
        .delete("/api/notes/123")
        .set({ Authorization: token })
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        note: {
          groupId: "a id",
          id: "123",
          title: "title",
          text: "text",
          latitude: 10,
          longitude: 10,
        },
      });
    });
  });
});
