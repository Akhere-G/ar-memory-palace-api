const request = require("supertest");
const app = require("../app");
const Group = require("../models/group");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("api/groups", () => {
  describe("POST api/groups/signin", () => {
    beforeAll(() => {
      jwt.sign = () => "token";
    });

    it("sends an error message that name is missing", async () => {
      const groupData = {
        password: "password",
      };

      Group.findOne = jest.fn(() => null);

      const response = await request(app)
        .post("/api/groups/signin")
        .send(groupData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "name and password are required",
      });
    });

    it("sends an error message thatpassword is missing", async () => {
      const groupData = {
        name: "name",
      };

      Group.findOne = jest.fn(() => null);

      const response = await request(app)
        .post("/api/groups/signin")
        .send(groupData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "name and password are required",
      });
    });

    it("fails when group doesn't exist", async () => {
      const groupData = {
        name: "name",
        password: "password",
      };

      Group.findOne = jest.fn(() => null);

      const response = await request(app)
        .post("/api/groups/signin")
        .send(groupData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        message: "group doesn't exist",
      });
    });

    it("sends an error message when credentials are invalid", async () => {
      const groupData = {
        name: "name",
        password: "password",
      };

      Group.findOne = jest.fn(() => ({
        name: "name",
        password: "hash_of_different_group",
      }));

      const response = await request(app)
        .post("/api/groups/signin")
        .send(groupData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Invalid credentials",
      });
    });
  });
});
