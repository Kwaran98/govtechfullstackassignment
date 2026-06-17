const express = require("express");
const cors = require("cors");

const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// A simple route to indicate API on Render:
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "School Administration API" });
});

app.use("/api", teacherRoutes);
app.use("/api", classRoutes);

// Any request that didn't match a route above.
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler which keeps every error in the { error } JSON shape
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
