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

/**
 * Book API Wrong/Error Scenario Tests
 *
 * Tests negative/error scenarios for Book routes:
 * - Create book with missing fields
 * - Create book with non-existent author or genre
 * - Get book with invalid/non-existent ID
 * - Update book with invalid/non-existent author/genre or empty title
 * - Delete book with invalid/non-existent ID
 */



describe("Book API - Wrong/Error Scenarios", () => {

  let token;
  let authorId;
  let genreId;

  const testUser = { username: "errorbookuser", password: "123456" };
  const testAuthor = { name: "Tolkien" };
  const testGenre = { name: "Adventure" };
  const testBook = {
    title: "The Hobbit",
    authorName: testAuthor.name,
    genreName: testGenre.name,
    publishedYear: 1937
  };

  before(async () => {
    // Clean DB
    await User.deleteMany({ username: testUser.username });
    await Author.deleteMany({ name: testAuthor.name });
    await Genre.deleteMany({ name: testGenre.name });
    await Book.deleteMany({ title: testBook.title });

    // Create valid author & genre
    const author = await Author.create(testAuthor);
    const genre = await Genre.create(testGenre);
    authorId = author._id;
    genreId = genre._id;

    // Register & login user
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send(testUser);
    token = loginRes.body.accessToken;
  });

  it("should fail to create a book with missing title", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        authorName: testAuthor.name,
        genreName: testGenre.name
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Title, authorName, and genreName are required");
  });

  it("should fail to create a book with non-existent author", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Fake Book",
        authorName: "NonExistentAuthor",
        genreName: testGenre.name
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Author or Genre not found");
  });

  it("should fail to create a book with non-existent genre", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Fake Book",
        authorName: testAuthor.name,
        genreName: "NonExistentGenre"
      });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Author or Genre not found");
  });

  it("should fail to get a book with invalid ID", async () => {
    const res = await request(app)
      .get("/api/books/invalidID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid book ID");
  });

  it("should fail to get a book with non-existent ID", async () => {
    const res = await request(app)
      .get("/api/books/63a123456789abcd12345678")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Book not found");
  });

  it("should fail to update a book with invalid ID", async () => {
    const res = await request(app)
      .put("/api/books/invalidID")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid book ID");
  });

  it("should fail to update a book with non-existent ID", async () => {
    const res = await request(app)
      .put("/api/books/63a123456789abcd12345678")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Book not found");
  });

  it("should fail to update a book with non-existent author", async () => {
    // First, create a valid book
    const bookRes = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send(testBook);

    const bookId = bookRes.body._id;

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ authorName: "NonExistentAuthor" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Author not found");

    // Clean up
    await Book.findByIdAndDelete(bookId);
  });

  it("should fail to update a book with non-existent genre", async () => {
    const bookRes = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send(testBook);

    const bookId = bookRes.body._id;

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ genreName: "NonExistentGenre" });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Genre not found");

    // Clean up
    await Book.findByIdAndDelete(bookId);
  });

  it("should fail to delete a book with invalid ID", async () => {
    const res = await request(app)
      .delete("/api/books/invalidID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("message", "Invalid book ID");
  });

  it("should fail to delete a book with non-existent ID", async () => {
    const res = await request(app)
      .delete("/api/books/63a123456789abcd12345678")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "Book not found");
  });

});