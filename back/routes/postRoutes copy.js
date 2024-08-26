const router = require('express').Router(); // api path 를 전달해 주는 메서드
const { postCourse } = require('../controllers/postCourse');

router.post('/post_course', postCourse);

module.exports = router; // router 모듈 내보내기