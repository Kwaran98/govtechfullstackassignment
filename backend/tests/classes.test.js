const request = require("supertest");

// Mock the database pool so tests run without a real Postgres connection.
jest.mock("../src/config/db", () => ({ query: jest.fn() }));
const pool = require("../src/config/db");
const app = require("../src/app");

const VALID = {
  level: "Primary 1",
  name: "Class 1A",
  teacherEmail: "teachermary@gmail.com",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/classes", () => {
  test("returns 201 with the spec-shaped formTeacher body", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Mary" }] }) // teacher lookup
      .mockResolvedValueOnce({ rows: [] }); // insert

    const res = await request(app).post("/api/classes").send(VALID);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      level: "Primary 1",
      name: "Class 1A",
      formTeacher: { name: "Mary" },
    });
  });

  test("returns 400 when a field is missing (without touching the DB)", async () => {
    const res = await request(app)
      .post("/api/classes")
      .send({ ...VALID, level: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(pool.query).not.toHaveBeenCalled();
  });

  test("returns 404 when the form teacher does not exist", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // lookup returns nothing

    const res = await request(app).post("/api/classes").send(VALID);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("returns 409 when the teacher is already a form teacher", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, name: "Mary" }] }) // teacher lookup
      .mockRejectedValueOnce({ code: "23505" }); // insert hits unique constraint

    const res = await request(app).post("/api/classes").send(VALID);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /api/classes", () => {
  test("returns 200 and nests the form teacher", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ level: "Primary 1", name: "Class 1A", teacher_name: "Mary" }],
    });

    const res = await request(app).get("/api/classes");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [
        { level: "Primary 1", name: "Class 1A", formTeacher: { name: "Mary" } },
      ],
    });
  });

  test("returns 500 with an error body on a DB failure", async () => {
    pool.query.mockRejectedValueOnce(new Error("db down"));

    const res = await request(app).get("/api/classes");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
