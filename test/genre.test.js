/**
 * Genre API Tests
 *
 * This file contains unit tests for the Genre routes:
 * - Create a new genre (`POST /api/genres`)
 * - Get all genres (`GET /api/genres`)
 * - Get a genre by ID (`GET /api/genres/:id`)
 * - Update a genre (`PUT /api/genres/:id`)
 * - Delete a genre (`DELETE /api/genres/:id`)
 *
 * Tests run with an authenticated user. A test user is registered and logged in before tests,
 * and a clean state is ensured by deleting test users and genres before starting.
 *
 * JWT token is used to authenticate requests to protected routes.
 */


import request from "supertest";
import { expect } from "chai";
import app from "../index.js";
import User from "../models/User.js";
import Genre from "../models/Genre.js";

describe("Genre API", () => {

  let token;
  let genreId;

  const testUser = {
    username: "genreuser",
    password: "123456"
  };

  const testGenre = {
    name: "Science Fiction",
    description: "Fiction based on futuristic science"
  };

  before(async () => {

    // Clean DB
    await User.deleteMany({ username: testUser.username });
    await Genre.deleteMany({ name: testGenre.name });

    // Register user
    await request(app)
      .post("/api/auth/register")
      .send(testUser);

    // Login user
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    token = loginRes.body.accessToken;
  });

  it("should create a new genre", async () => {

    const res = await request(app)
      .post("/api/genres")
      .set("Authorization", `Bearer ${token}`)
      .send(testGenre);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id");

    genreId = res.body._id;
  });

  it("should get all genres", async () => {

    const res = await request(app)
      .get("/api/genres")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should get genre by ID", async () => {

    const res = await request(app)
      .get(`/api/genres/${genreId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", genreId);
  });

  it("should update genre", async () => {

    const res = await request(app)
      .put(`/api/genres/${genreId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Sci-Fi Updated" });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("Sci-Fi Updated");
  });

  it("should delete genre", async () => {

    const res = await request(app)
      .delete(`/api/genres/${genreId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Genre deleted successfully");
  });

});