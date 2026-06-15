CREATE TABLE teachers (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL, 
    subject             VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    contact_number      VARCHAR(20) NOT NULL
);

CREATE TABLE classes (
    id                  SERIAL PRIMARY KEY,
    level               VARCHAR(100) NOT NULL,
    name                VARCHAR(100) NOT NULL,
    form_teacher_id     INTEGER NOT NULL UNIQUE REFERENCES teachers(id) ON DELETE RESTRICT
);
