const {
  isValidEmail,
  isValidContactNumber,
  validateTeacher,
  validateClass,
} = require("../src/utils/validation");

describe("isValidEmail", () => {
  test("accepts a gmail.com address", () => {
    expect(isValidEmail("teachermary@gmail.com")).toBe(true);
  });

  test("ignores surrounding whitespace", () => {
    expect(isValidEmail("  mary@gmail.com  ")).toBe(true);
  });

  test("rejects a non-gmail domain", () => {
    expect(isValidEmail("mary@yahoo.com")).toBe(false);
  });

  test("rejects a malformed address", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  test("rejects a non-string value", () => {
    expect(isValidEmail(12345)).toBe(false);
  });
});

describe("isValidContactNumber", () => {
  test("accepts exactly 8 digits", () => {
    expect(isValidContactNumber("68129414")).toBe(true);
  });

  test("accepts 8 digits with spaces", () => {
    expect(isValidContactNumber("6812 9414")).toBe(true);
  });

  test("rejects fewer than 8 digits", () => {
    expect(isValidContactNumber("1234567")).toBe(false);
  });

  test("rejects more than 8 digits", () => {
    expect(isValidContactNumber("123456789")).toBe(false);
  });

  test("rejects letters", () => {
    expect(isValidContactNumber("1234567a")).toBe(false);
  });
});

describe("validateTeacher", () => {
  const valid = {
    name: "Mary",
    subject: "Mathematics",
    email: "teachermary@gmail.com",
    contactNumber: "68129414",
  };

  test("returns null for a valid teacher", () => {
    expect(validateTeacher(valid)).toBeNull();
  });

  test("flags a missing name", () => {
    expect(validateTeacher({ ...valid, name: "" })).toMatch(/name/i);
  });

  test("flags a missing subject", () => {
    expect(validateTeacher({ ...valid, subject: "" })).toMatch(/subject/i);
  });

  test("flags an invalid email", () => {
    expect(validateTeacher({ ...valid, email: "mary@outlook.com" })).toMatch(
      /email/i
    );
  });

  test("flags an invalid contact number", () => {
    expect(validateTeacher({ ...valid, contactNumber: "12" })).toMatch(
      /contact/i
    );
  });

  test("flags a completely empty body", () => {
    expect(validateTeacher()).not.toBeNull();
  });
});

describe("validateClass", () => {
  const valid = {
    level: "Primary 1",
    name: "Class 1A",
    teacherEmail: "teachermary@gmail.com",
  };

  test("returns null for a valid class", () => {
    expect(validateClass(valid)).toBeNull();
  });

  test("flags a missing level", () => {
    expect(validateClass({ ...valid, level: "" })).toMatch(/level/i);
  });

  test("flags a missing name", () => {
    expect(validateClass({ ...valid, name: "" })).toMatch(/name/i);
  });

  test("flags a missing teacherEmail", () => {
    expect(validateClass({ ...valid, teacherEmail: "" })).toMatch(
      /teacherEmail/i
    );
  });
});
