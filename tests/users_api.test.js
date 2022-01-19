const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("../utils/user_helper");

const User = require("../models/user");

describe("creating users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialUsers);
  });

  test("creating fails if username is too short or empty", async () => {
    const newUser = {
      username: "",
      name: "Wik Srik",
      password: "123",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("creating fails if password is too short or empty", async () => {
    const newUser = {
      username: "Wik",
      name: "Wik Srik",
      password: "12",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("creating fails if username is not unique", async () => {
    const newUser = {
      username: "wik",
      name: "Wik Srik",
      password: "123",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("creating user passes if all values are valid", async () => {
    const newUser = {
      username: "Wikiki",
      name: "Wik Srik",
      password: "123",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
