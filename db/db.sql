create TABLE person(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255)
);

create TABLE token(
    id SERIAL PRIMARY KEY,
    refreshToken VARCHAR(255),
    userId INTEGER REFERENCES person (id)
);

create TABLE quizzes (
    id SERIAL PRIMARY KEY,
    quizID VARCHAR(255),
    userId INTEGER REFERENCES person (id)
    quiz JSONB,
);
