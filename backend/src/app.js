const express = require('express');
const cors = require('cors');

const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', teacherRoutes);
app.use('/api', classRoutes);

module.exports = app;
