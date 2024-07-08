"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Job = require("../models/job");
const Company = require("../models/company");
const { createToken } = require("../helpers/tokens");

const testJobIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM applications");
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM users");

  await Company.create(
    { handle: "c1", name: "C1", description: "Desc1", numEmployees: 1, logoUrl: "http://c1.img" });

  await Job.create(
    { title: "J1", salary: 100, equity: "0.01", companyHandle: "c1" });
  await Job.create(
    { title: "J2", salary: 200, equity: "0.02", companyHandle: "c1" });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });

  const job1 = await Job.create(
    { title: "J1", salary: 100, equity: "0.01", companyHandle: "c1" });
  const job2 = await Job.create(
    { title: "J2", salary: 200, equity: "0.02", companyHandle: "c1" });

  testJobIds[0] = job1.id;
  testJobIds[1] = job2.id;

  await User.applyToJob("u1", testJobIds[0]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  testJobIds,
};
