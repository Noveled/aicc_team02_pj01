const router = require('express').Router(); // api path 를 전달해 주는 메서드
const { getCourse } = require('../controllers/getCourse');


router.get('/get_course', getCourse); // 컨트롤러 함수 연결 - :은 정해지지 않은 문자열 표시


module.exports = router; // router 모듈 내보내기