const request = require("supertest");
const app = require("../app");
const Group = require("../models/group");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("api/groups", () => {
  describe("get api/groups/refresh", () => {
    beforeAll(() => {
      jwt.sign = () => "token";
    });

    it("sends an error message when authorisation header is missing", async () => {
      const response = await request(app)
        .get("/api/groups/refresh")
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "Bearer Header is required",
      });
    });

    it("sends an error message when invalid token is sent", async () => {
      const token = "Bearer token";
      const response = await request(app)
        .get("/api/groups/refresh")
        .set({ Authorization: token })
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(401);
      expect(response.body).toStrictEqual({
        message: "You need to log into a group to see its notes",
      });
    });

    it("sends an error message when group no longer exists", async () => {
      const token = "Bearer token";
      jwt.verify = jest.fn(() => ({ id: "a id" }));
      Group.findById = jest.fn(() => null);

      const response = await request(app)
        .get("/api/groups/refresh")
        .set({ Authorization: token })
        .expect("Content-Type", /json/);

      expect(Group.findById).toBeCalled();
      expect(jwt.verify).toBeCalled();
      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        message: "This group doesn't exist",
      });
    });

    it("sends the token successfully when given valid token ", async () => {
      const token = "Bearer token";
      jwt.verify = jest.fn(() => ({ id: "a id" }));
      Group.findById = jest.fn(() => ({
        name: "name",
        summary: "summary",
        _id: "id",
      }));

      const response = await request(app)
        .get("/api/groups/refresh")
        .set({ Authorization: token })
        .expect("Content-Type", /json/);

      expect(Group.findById).toBeCalled();
      expect(jwt.verify).toBeCalled();
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        group: {
          id: "id",
          name: "name",
          summary: "summary",
        },
        token: "token",
      });
    });
  });
});
