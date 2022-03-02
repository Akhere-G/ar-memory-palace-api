const request = require("supertest");
const app = require("./app");
const Group = require("./models/group");

describe("api/groups", () => {
  describe("POST api/groups/create", () => {
    it("Group name has been taken", async () => {
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
  });
});
