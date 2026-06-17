const pool = require("../config/db");
const { validateClass } = require("../utils/validation");

const addNewClass = async (req, res) => {
  const validationError = validateClass(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Lowercase the email so it matches how teachers are stored on insert.
  const level = req.body.level.trim();
  const name = req.body.name.trim();
  const teacherEmail = req.body.teacherEmail.trim().toLowerCase();

  try {
    // Find the form teacher by email
    const teacher = await pool.query(
      "SELECT id, name FROM teachers WHERE email = $1",
      [teacherEmail]
    );

    // A class requires a real form teacher, so reject unknown emails.
    if (teacher.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Teacher with this email does not exist" });
    }

    await pool.query(
      `INSERT INTO classes (level, name, form_teacher_id)
       VALUES ($1, $2, $3)`,
      [level, name, teacher.rows[0].id]
    );

    // Respond in the same shape as GET /api/classes
    return res.status(201).json({
      level,
      name,
      formTeacher: { name: teacher.rows[0].name },
    });
  } catch (error) {
    // 23505 dictates Postgres unique_violation. The UNIQUE constraint on
    // classes.form_teacher_id enforces "one class per form teacher".
    if (error.code === "23505") {
      return res.status(409).json({
        error: "This teacher is already a form teacher of another class",
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

const getClasses = async (req, res) => {
  try {
    // Join to resolve each class's form_teacher_id into the teacher's name.
    const result = await pool.query(
      `SELECT c.level, c.name, t.name AS teacher_name
       FROM classes c
       JOIN teachers t ON t.id = c.form_teacher_id
       ORDER BY c.level, c.name`
    );

    // Reshape flat rows into the nested API response the spec expects.
    const data = result.rows.map((row) => ({
      level: row.level,
      name: row.name,
      formTeacher: {
        name: row.teacher_name,
      },
    }));

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addNewClass, getClasses };
