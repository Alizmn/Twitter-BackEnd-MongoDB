const request = require("supertest");
const app = require("../app");
const http = require("http");
const server = http.createServer(app);
const mongoose = require("mongoose");
const db = require("../db");
const User = require("../db/Schema/userSchema");

const john = {
  username: "johnJ",
  name: "john Due",
  email: "John@Due.com",
  password: "123456",
};

const token = "very nice token";

describe("Register Endpoints", () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  it("should create a new user", async () => {
    const res = await request(server).post("/auth/register").send(john);
    expect(res.body.msg).toEqual("created successfully");
  });

  it("should not create a user when username exist", async () => {
    await request(server).post("/auth/register").send(john);
    const res = await request(server).post("/auth/register").send(john);
    expect(res.body.msg).toEqual("username already exist");
  });

  it("should not create a user when required fields are empty", async () => {
    const res = await request(server).post("/auth/register").send({
      username: "",
      name: "john Due",
      email: "John@Due.com",
      password: "123456",
    });
    expect(res.body.msg).toEqual("Please provide all the requierd fields");
  });

  it("should not let you signup when you are logged in", async () => {
    const res = await request(server)
      .post("/auth/register")
      .set("authorization", token)
      .send(john);
    expect(res.body.msg).toEqual("You are already in, logout first!");
  });
});

describe("Login Endpoints", () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  it("should login with correct username password and return the token", async () => {
    // -----REGISTER JOHN FIRST-------
    await request(server).post("/auth/register").send(john);
    //-----TRY TO LOGIN-----
    const res = await request(server).post("/auth/login").send({
      username: "johnj",
      password: "123456",
    });
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("token");
  });
  it("should not login with wrong credentials", async () => {
    // -----REGISTER JOHN FIRST-------
    await request(server).post("/auth/register").send(john);
    //-----TRY TO LOGIN-----
    const res = await request(server).post("/auth/login").send({
      username: "johnJ",
      password: "12345",
    });
    expect(res.body.msg).toEqual("Incorrect email or password");
  });
  it("should not login when username or password is empty", async () => {
    const res = await request(server).post("/auth/login").send({
      username: "",
      password: "12345",
    });
    expect(res.body.msg).toEqual("Missing credentials");
  });
  it("should not login when you are already logged in", async () => {
    const res = await request(server)
      .post("/auth/login")
      .set("authorization", token)
      .send({});
    expect(res.body.msg).toEqual("You are already in, logout first!");
  });
});
