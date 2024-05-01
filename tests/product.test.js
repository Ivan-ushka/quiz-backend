const mongoose = require("mongoose");
const request = require("supertest");
const uuid = require("uuid");
const { app } = require("../index.js");
const UserModel = require("../models/user-module")
const userService = require("../service/user-service.js");

require("dotenv").config();

/* Connect database connection*/
beforeEach(async () => {
  await mongoose.connect(process.env.DB_URL);
});

describe("Express Tests", () => {

  const userObj = {
      name: "User1",
      email: 'ivanlev10@gmail.com',
      password: "1234",
  };


  it("should create a user", async () => {
    const res = await request(app).post("/api/registration").send(userObj);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe("User1");
  });


  // TODO: make response code 409
  it("creating dublicate user. should return 400", async () => {
    const res = await request(app).post("/api/registration").send(userObj);
    console.log(res.body)
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(`Пользователь с почтовым адресом ${userObj.email} уже существует `);
  });


  it("check authorization", async () => {
    const res = await request(app).post("/api/login").send(userObj);
    expect(res.statusCode).toBe(200);
  });


  it("check authorization with wrong password", async () => {
    const res = await request(app).post("/api/login").send({
      email: userObj.email,
      password: '12345'
    });
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe('Неверный пароль');
  });


  it("check authorization with wrong email", async () => {
    const res = await request(app).post("/api/login").send({
      email: userObj.email + 'a',
      password: '12345'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Пользователь с таким email не найден');
  });


  it("check logout", async () => {
    const res = await request(app).post("/api/login").send(userObj);
    const refreshToken = res.body.refreshToken
    const res2 = await request(app).post("/api/logout").send(refreshToken);
    expect(res.statusCode).toBe(200);
  });


  it("check password", async () => {
    const res = await request(app).post("/api/checkPwd").send(userObj);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(true);
  });


  it("check wrong password", async () => {
    const res = await request(app).post("/api/checkPwd").send({
      email: userObj.email,
      password: '12345',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(false);
  });
});


/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});