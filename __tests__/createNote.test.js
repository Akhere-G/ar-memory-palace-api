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

    it("sends an error message when the title is too long", async () => {
      const token = "Bearer token";
      const note = {
        title: "1234567890123456789012345678901",
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
      expect(response.body).toStrictEqual({
        message: "title must be at most 30 characters",
      });
    });

    it("sends an error message when the text is missing", async () => {
      const token = "Bearer token";
      const note = {
        title: "a title",
        groupId: "a id",
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
      expect(response.body).toStrictEqual({
        message: "text is missing",
      });
    });

    it("sends an error message when the text is too long", async () => {
      const token = "Bearer token";
      const note = {
        title: "a title",
        text: `12345678901234567890123456789012345678901234567890
               12345678901234567890123456789012345678901234567890
               12345678901234567890123456789012345678901234567890
               12345678901234567890123456789012345678901234567890
               12345678901234567890123456789012345678901234567890
               12345678901234567890123456789012345678901234567890`,
        groupId: "a id",
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
      expect(response.body).toStrictEqual({
        message: "text must be at most 250 characters",
      });
    });

    it("sends an error message when the latitude is missing", async () => {
      const token = "Bearer token";
      const note = {
        title: "a title",
        text: "a text",
        groupId: "a id",
        longitude: 10,
      };

      Note.find = jest.fn(() => []);
      const response = await request(app)
        .post("/api/notes")
        .set({ Authorization: token })
        .send(note)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "latitude is missing",
      });
    });

    it("sends an error message when the longitude is missing", async () => {
      const token = "Bearer token";
      const note = {
        title: "a title",
        text: "a text",
        groupId: "a id",
        latitude: 10,
      };

      Note.find = jest.fn(() => []);
      const response = await request(app)
        .post("/api/notes")
        .set({ Authorization: token })
        .send(note)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "longitude is missing",
      });
    });

    it("sends a sucess message when given a correctly formatted note", async () => {
      const token = "Bearer token";
      const note = {
        title: "a title",
        text: "a text",
        groupId: "a id",
        latitude: 10,
        longitude: 10,
      };

      Note.find = jest.fn(() => []);
      const response = await request(app)
        .post("/api/notes")
        .set({ Authorization: token })
        .send(note)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual({
        note: {
          groupId: "a id",
          latitude: 10,
          longitude: 10,
          text: "a text",
          title: "a title",
        },
      });
    });
  });
});
