const pool = require("../config/db");
const { validateTeacher } = require("../utils/validation");

const registerTeacher = async (req, res) => {
  const validationError = validateTeacher(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Over here wer are trying to normalize input by trim text, lowercase the email  and strip spaces from the contact number so it stores consistently.
  const name = req.body.name.trim();
  const subject = req.body.subject.trim();
  const email = req.body.email.trim().toLowerCase();
  const contactNumber = req.body.contactNumber.replace(/\s+/g, "");

  try {
    // RETURNING maps the row straight into the API response shape, so the internal `id` is never exposed.
    const result = await pool.query(
      `INSERT INTO teachers (name, subject, email, contact_number)
       VALUES ($1, $2, $3, $4)
       RETURNING name, subject, email, contact_number AS "contactNumber"`,
      [name, subject, email, contactNumber]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    // 23505 is the Postgres unique_violation that is triggered by the UNIQUE constraint on teachers.email.
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "A teacher with this email already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTeachers = async (req, res) => {
  try {
    // Alias contact_number -> contactNumber so the column matches the API field.
    const result = await pool.query(
      `SELECT name, subject, email, contact_number AS "contactNumber" FROM teachers ORDER BY name`
    );
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerTeacher, getTeachers };
