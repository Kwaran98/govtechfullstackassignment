const request = require("supertest");

// Mock the database pool so tests run without a real Postgres connection.
jest.mock("../src/config/db", () => ({ query: jest.fn() }));
const pool = require("../src/config/db");
const app = require("../src/app");

const VALID = {
  name: "Mary",
  subject: "Mathematics",
  email: "teachermary@gmail.com",
  contactNumber: "68129414",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/teachers", () => {
  test("returns 201 with a clean, spec-shaped body", async () => {
    pool.query.mockResolvedValueOnce({ rows: [VALID] });

    const res = await request(app).post("/api/teachers").send(VALID);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(VALID);
    expect(res.body.id).toBeUndefined();
  });

  test("returns 400 when a field is missing (without touching the DB)", async () => {
    const res = await request(app)
      .post("/api/teachers")
      .send({ ...VALID, name: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("returns 400 when the email is not a gmail address", async () => {
    const res = await request(app)
      .post("/api/teachers")
      .send({ ...VALID, email: "mary@yahoo.com" });

    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("returns 400 when the contact number is not 8 digits", async () => {
    const res = await request(app)
      .post("/api/teachers")
      .send({ ...VALID, contactNumber: "123" });

    expect(res.status).toBe(400);
  });

  test("returns 409 when the email already exists", async () => {
    pool.query.mockRejectedValueOnce({ code: "23505" });

    const res = await request(app).post("/api/teachers").send(VALID);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  test("normalizes email casing and strips spaces from the number", async () => {
    pool.query.mockResolvedValueOnce({ rows: [VALID] });

    await request(app)
      .post("/api/teachers")
      .send({ ...VALID, email: "TeacherMary@Gmail.com", contactNumber: "6812 9414" });

    const params = pool.query.mock.calls[0][1];
    expect(params).toEqual([
      "Mary",
      "Mathematics",
      "teachermary@gmail.com",
      "68129414",
    ]);
  });
});

describe("GET /api/teachers", () => {
  test("returns 200 with a data array", async () => {
    pool.query.mockResolvedValueOnce({ rows: [VALID] });

    const res = await request(app).get("/api/teachers");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [VALID] });
  });

  test("returns 500 with an error body on a DB failure", async () => {
    pool.query.mockRejectedValueOnce(new Error("db down"));

    const res = await request(app).get("/api/teachers");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
