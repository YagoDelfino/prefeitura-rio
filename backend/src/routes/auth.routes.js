const express = require("express");
const router = express.Router();

const { login } = require("../services/authService");

router.post("/token", login);

module.exports = router;