const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("../utils/list_helper");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImN6YWtha2FrYSIsImlkIjoiNjE1ZWI2NDNlMTQ3NzcyODY0ZGIyNmZlIiwiaWF0IjoxNjMzNTk3MDAwfQ._dazw8Ebz5qVpHYwrWd43FKw80_MreXMDNwbX5f5EQ0";

const invalidToken =
  "esJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImN6YWtha2FrYSIsImlkIjoiNjE1ZWI2NDNlMTQ3NzcyODY0ZGIyNmZlIiwiaWF0IjoxNjMzNTk3MDAwfQ._dazw8Ebz5qVpHYwrWd43FKw80_MreXMDNwbX5f5EQ0";

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test("verify that the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("when creating a blog", () => {
  test("request is invalid without a proper token", async () => {
    const newBlog = {
      title: "Rurian",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });

  test("request successfully creates a new blog post", async () => {
    const newBlog = {
      title: "Rurian",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((blog) => blog.title);

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain("Rurian");
  });

  test("default value of likes is 0", async () => {
    await Blog.deleteMany({});

    const newBlog = {
      title: "Rurian",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog);

    const response = await api.get("/api/blogs");

    expect(response.body[0].likes).toBe(0);
  });

  test("title and url are not missing", async () => {
    await Blog.deleteMany({});

    const newBlog = {
      author: "Michael Chan",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(400);
  });
});

describe("deletion of blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogs = await api.get("/api/blogs");
    const blogToDelete = blogs.body[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);

    const blogsAtEnd = await api.get("/api/blogs");

    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.body.map((blog) => blog.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test("fails with status code 401 if token is invalid", async () => {
    const blogs = await api.get("/api/blogs");
    const blogToDelete = blogs.body[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "Bearer " + invalidToken)
      .expect(401);

    const blogsAtEnd = await api.get("/api/blogs");

    expect(blogsAtEnd.body).toHaveLength(helper.initialBlogs.length);

    const titles = blogsAtEnd.body.map((blog) => blog.title);

    expect(titles).toContain(blogToDelete.title);
  });
});

describe("updating invidual blog", () => {
  test("succeds with status code 201 if id is valid", async () => {
    const blogs = await api.get("/api/blogs");
    const blogToUpdate = blogs.body[0];
    blogToUpdate.likes = 2;

    await api.put(`/api/blogs/${blogToUpdate.id}`, blogToUpdate).expect(201);

    expect(blogs.body[0].likes).toBe(2);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
