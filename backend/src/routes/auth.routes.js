const express = require("express");
const router = express.Router();

const { login } = require("../services/authService");
const { authentication } = require("../services/authService");

router.post("/token", login);
router.get("/validate", authentication, (request, response) => {
	return response.status(200).json({ valid: true });
});

module.exports = router;