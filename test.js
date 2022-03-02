const request = require("supertest");
const app = require("./app");
const Group = require("./models/group");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("api/groups", () => {
  describe("POST api/groups/create", () => {
    beforeAll(() => {
      jwt.sign = () => "token";
    });

    it("fails when group name has been taken", async () => {
      const groupData = {
        named: "name",
        summary: "summary",
        password: "password",
        confirmPassword: "password",
        latitude: "10",
        longitude: "20",
      };

      Group.findOne = jest.fn(() => groupData);

      const response = await request(app)
        .post("/api/groups/create")
        .send(groupData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "This name has been taken",
      });
    });

    it("creates group successfully", async () => {
      const expectedGroupData = {
        name: "name",
        summary: "summary",
        latitude: "10",
        longitude: "20",
      };
      const formData = {
        ...expectedGroupData,
        password: "password",
        confirmPassword: "password",
      };

      const expectedResponseData = {
        group: expectedGroupData,
        token: "token",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual(expectedResponseData);
    });

    // name validation
    it("sends error message when name is missing ", async () => {
      const formData = {
        summary: "summary",
        latitude: "10",
        longitude: "20",
        password: "password",
        confirmPassword: "password",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "name is missing",
      });
    });

    it("sends error message when name is too short ", async () => {
      const formData = {
        name: "s",
        summary: "summary",
        latitude: "10",
        password: "password",
        longitude: "20",
        confirmPassword: "password",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "name must be at least 4 characters",
      });
    });

    it("sends error message when name is too long ", async () => {
      const formData = {
        name: "1234567890123456789012345678901",
        summary: "summary",
        latitude: "10",
        password: "password",
        longitude: "20",
        confirmPassword: "password",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "name must be at most 30 characters",
      });
    });
    // Summary validation

    it("sends error message when summary is missing ", async () => {
      const formData = {
        name: "name",
        latitude: "10",
        longitude: "20",
        password: "password",
        confirmPassword: "password",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "summary is missing",
      });
    });

    it("sends error message when summary is too short ", async () => {
      const formData = {
        name: "name",
        summary: "s",
        latitude: "10",
        password: "password",
        longitude: "20",
        confirmPassword: "password",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "summary must be at least 4 characters",
      });
    });

    it("sends error message when summary is too long ", async () => {
      const formData = {
        name: "name",
        summary: `123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  
                  1234567890123456789012345678901
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890

                  1234567890123456789012345678901
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  123456789012345678901234567890
                  `,
        latitude: "10",
        password: "password",
        longitude: "20",
        confirmPassword: "password",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "summary must be at most 300 characters",
      });
    });

    // password validation

    it("sends error message when passwords don't match", async () => {
      const formData = {
        name: "name",
        summary: "summary",
        latitude: "10",
        longitude: "20",
        password: "qwertyuiop",
        confirmPassword: "password",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "passwords do not match",
      });
    });

    it("sends error message when password is too short ", async () => {
      const formData = {
        name: "name",
        summary: "summary",
        latitude: "10",
        password: "p",
        longitude: "20",
        confirmPassword: "p",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "password must be at least 4 characters",
      });
    });

    it("sends error message when password is too long", async () => {
      const formData = {
        name: "name",
        summary: "summary",
        latitude: "10",
        longitude: "20",
        password: "1234567890123456789012345678901",
        confirmPassword: "1234567890123456789012345678901",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "password must be at most 30 characters",
      });
    });

    // longitude and latitude

    it("sends error message when longitude is misisng", async () => {
      const formData = {
        name: "name",
        summary: "summary",
        latitude: "10",
        password: "123456",
        confirmPassword: "123456",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "longitude is missing",
      });
    });

    it("sends error message when longitude is misisng", async () => {
      const formData = {
        name: "name",
        summary: "summary",
        longitude: "10",
        password: "123456",
        confirmPassword: "123456",
      };

      Group.findOne = jest.fn(() => null);
      Group.create = jest.fn((data) => data);

      const response = await request(app)
        .post("/api/groups/create")
        .send(formData)
        .expect("Content-Type", /json/);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        message: "latitude is missing",
      });
    });
  });
});
