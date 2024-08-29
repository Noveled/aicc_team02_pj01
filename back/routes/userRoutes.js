const router = require("express").Router();
const { postUser, loginUser } = require("../controllers/postUser");

router.post("/register", postUser);
router.post("/login", loginUser);

module.exports = router;