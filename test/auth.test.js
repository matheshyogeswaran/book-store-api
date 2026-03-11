
/**
 * Auth API Tests
 *
 * This file contains unit tests for the authentication routes:
 * - User registration (`POST /api/auth/register`)
 * - User login (`POST /api/auth/login`)
 * - Login failure with wrong password
 *
 * Each test runs with a clean state: users with the same username are deleted before each test.
 */

import request from "supertest";
import { expect } from "chai";
import app from "../index.js";
import User from "../models/User.js";

describe("Auth API", () => {

  const user = {
    username: "testuser",
    password: "123456"
  };

  // clean user before each test
  beforeEach(async () => {
    await User.deleteMany({ username: user.username });
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");
  });

  it("should login successfully", async () => {

    // create user first
    await request(app)
      .post("/api/auth/register")
      .send(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send(user);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("accessToken");
  });

  it("should fail with wrong password", async () => {

    // create user first
    await request(app)
      .post("/api/auth/register")
      .send(user);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "wrongpassword"
      });

    expect(res.status).to.equal(401);
  });

});