<<<<<<< HEAD
const router = require('express').Router(); // api path 를 전달해 주는 메서드
const { getCourse } = require('../controllers/getCourse');
const { getFacilities } = require('../controllers/getFacilities');

router.get('/get_course', getCourse); // 컨트롤러 함수 연결 - :은 정해지지 않은 문자열 표시
router.get('/get_facilities', getFacilities); // 편의시설 위치 api

=======
const router = require("express").Router(); // api path 를 전달해 주는 메서드
const { getCourse } = require("../controllers/getCourse");

router.get("/get_course/", getCourse); // 컨트롤러 함수 연결 - :은 정해지지 않은 문자열 표시

>>>>>>> 35154f52c93053e92cc72f08992ecbcc9fd47e3a
module.exports = router; // router 모듈 내보내기
