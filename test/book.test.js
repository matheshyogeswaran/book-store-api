/**
 * Book API Tests
 *
 * This file contains unit tests for the Book routes:
 * - Create a new book (`POST /api/books`)
 * - Get all books (`GET /api/books`)
 * - Get a book by ID (`GET /api/books/:id`)
 * - Update a book (`PUT /api/books/:id`)
 * - Delete a book (`DELETE /api/books/:id`)
 *
 * Tests run with an authenticated user. A test user is registered and logged in before tests,
 * and a clean state is ensured by deleting test users, authors, genres, and books before starting.
 *
 * Related data:
 * - Author and Genre must exist before creating a book; these are created during test setup.
 * - JWT token is used to authenticate requests to protected routes.
 */

import request from "supertest";
import { expect } from "chai";
import app from "../index.js";
import User from "../models/User.js";
import Author from "../models/Author.js";
import Genre from "../models/Genre.js";
import Book from "../models/Book.js";

describe("Book API", () => {
  let token; // JWT token
  let authorId;
  let genreId;
  let bookId;

  const testUser = { username: "bookuser", password: "123456" };
  const testAuthor = { name: "J.K. Rowling" };
  const testGenre = { name: "Fantasy" };
  const testBook = {
    title: "Harry Potter",
    authorName: testAuthor.name,
    genreName: testGenre.name,
    publishedYear: 2000
  };

  // Clean DB before tests
  before(async () => {
    await User.deleteMany({ username: testUser.username });
    await Author.deleteMany({ name: testAuthor.name });
    await Genre.deleteMany({ name: testGenre.name });
    await Book.deleteMany({ title: testBook.title });

    // Create author & genre
    const author = await Author.create(testAuthor);
    const genre = await Genre.create(testGenre);
    authorId = author._id;
    genreId = genre._id;

    // Register & login user to get token
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send(testUser);
    token = loginRes.body.accessToken;
  });

  it("should create a new book", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send(testBook);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id");
    expect(res.body.title).to.equal(testBook.title);
    bookId = res.body._id; 
  });

  it("should get all books", async () => {
    const res = await request(app)
      .get("/api/books")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("should get book by ID", async () => {
    const res = await request(app)
      .get(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id", bookId);
  });

  it("should update a book", async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Harry Potter Updated" });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal("Harry Potter Updated");
  });

  it("should delete a book", async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Book deleted successfully");
  });

});