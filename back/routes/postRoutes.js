const router = require("express").Router();
const { postUser, loginUser } = require("../controllers/postUser");
const { postCourse } = require("../controllers/postCourse");

router.post("/register", postUser);
router.post("/login", loginUser);

router.post("/make_course", postCourse);

module.exports = router;
