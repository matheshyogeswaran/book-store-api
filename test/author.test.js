/**
 * Author API Tests
 *
 * This file contains unit tests for the Author routes:
 * - Create a new author (`POST /api/authors`)
 * - Get all authors (`GET /api/authors`)
 * - Get an author by ID (`GET /api/authors/:id`)
 * - Update an author (`PUT /api/authors/:id`)
 * - Delete an author (`DELETE /api/authors/:id`)
 *
 * Tests run with an authenticated user. A test user is registered and logged in before tests,
 * and a clean state is ensured by deleting test users and authors before starting.
 */


import request from "supertest";
import { expect } from "chai";
import app from "../index.js";

import User from "../models/User.js";
import Author from "../models/Author.js";

describe("Author API", () => {

  let token;
  let authorId;

  const testUser = {
    username: "authoruser",
    password: "123456"
  };

  const testAuthor = {
    name: "George Orwell",
    bio: "English novelist"
  };

  before(async () => {

    // clean test data
    await User.deleteMany({ username: testUser.username });
    await Author.deleteMany({ name: testAuthor.name });

    // register user
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // login user
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    token = loginRes.body.accessToken;
  });

  it("should create a new author", async () => {

    const res = await request(app)
      .post("/api/authors")
      .set("Authorization", `Bearer ${token}`)
      .send(testAuthor);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id");

    authorId = res.body._id;
  });

  it("should get all authors", async () => {

    const res = await request(app)
      .get("/api/authors")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should get author by ID", async () => {

    const res = await request(app)
      .get(`/api/authors/${authorId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", authorId);
  });

  it("should update an author", async () => {

    const res = await request(app)
      .put(`/api/authors/${authorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "George Orwell Updated" });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("George Orwell Updated");
  });

  it("should delete an author", async () => {

    const res = await request(app)
      .delete(`/api/authors/${authorId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Author deleted successfully");
  });

});

describe("Author API - Wrong/Error Scenarios", () => {

  let token;
  let authorId;

  const testUser = {
    username: "erroruser",
    password: "123456"
  };

  const testAuthor = {
    name: "J.K. Rowling",
    bio: "British author"
  };

  before(async () => {
    // Clean test data
    await User.deleteMany({ username: testUser.username });
    await Author.deleteMany({ name: testAuthor.name });

    // Register user
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // Login user
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    token = loginRes.body.accessToken;

    // Create a valid author for some tests
    const authorRes = await request(app)
      .post("/api/authors")
      .set("Authorization", `Bearer ${token}`)
      .send(testAuthor);

    authorId = authorRes.body._id;
  });

  it("should fail to create an author with missing name", async () => {
    const res = await request(app)
      .post("/api/authors")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Bio only" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Author name is required");
  });

  it("should fail to get author with invalid ID", async () => {
    const res = await request(app)
      .get("/api/authors/invalidID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid author ID");
  });

  it("should fail to get author with non-existent ID", async () => {
    const res = await request(app)
      .get("/api/authors/63a123456789abcd12345678") // random valid ObjectId
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Author not found");
  });

  it("should fail to update author with empty name", async () => {
    const res = await request(app)
      .put(`/api/authors/${authorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Name cannot be empty");
  });

  it("should fail to update author with invalid ID", async () => {
    const res = await request(app)
      .put("/api/authors/invalidID")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Name" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid author ID");
  });

  it("should fail to update author with non-existent ID", async () => {
    const res = await request(app)
      .put("/api/authors/63a123456789abcd12345678")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Name" });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Author not found");
  });

  it("should fail to delete author with invalid ID", async () => {
    const res = await request(app)
      .delete("/api/authors/invalidID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid author ID");
  });

  it("should fail to delete author with non-existent ID", async () => {
    const res = await request(app)
      .delete("/api/authors/63a123456789abcd12345678")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Author not found");
  });

});