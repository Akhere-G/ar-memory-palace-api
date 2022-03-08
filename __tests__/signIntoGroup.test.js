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

    it("fails when group doesn't exist", async () => {
      const groupData = {
        named: "name",
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
  });
});
