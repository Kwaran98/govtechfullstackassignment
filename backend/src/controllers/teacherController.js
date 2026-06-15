const pool = require("../config/db");
const { validateTeacher } = require("../utils/validation");

const registerTeacher = async (req, res) => {
  const validationError = validateTeacher(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Normalize: trim text, lowercase the email, strip spaces from the number.
  const name = req.body.name.trim();
  const subject = req.body.subject.trim();
  const email = req.body.email.trim().toLowerCase();
  const contactNumber = req.body.contactNumber.replace(/\s+/g, "");

  try {
    const result = await pool.query(
      `INSERT INTO teachers (name, subject, email, contact_number)
       VALUES ($1, $2, $3, $4)
       RETURNING name, subject, email, contact_number AS "contactNumber"`,
      [name, subject, email, contactNumber]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    // Postgres unique violation error code
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
    const result = await pool.query(
      `SELECT name, subject, email, contact_number AS "contactNumber" FROM teachers ORDER BY name`
    );
    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerTeacher, getTeachers };
