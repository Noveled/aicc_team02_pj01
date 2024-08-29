const router = require("express").Router(); // api path 를 전달해 주는 메서드

const { getUser } = require("../controllers/getUser");
const { getUserJoinCourse } = require("../controllers/getUserJoinCourse");
const { getUsers } = require("../controllers/getUsers");
const { getUsersJoinCourse } = require("../controllers/getUsersJoinCourse");
const { getCourse } = require("../controllers/getCourse");
const { getFacilities } = require("../controllers/getFacilities");

router.get("/get_user/:userId", getUser); // 로그인한 유저정보
router.get("/get_user_join_course/:userId", getUserJoinCourse); // 한명의 유저와 코스 조인
router.get("/get_users", getUsers); // 전체 유저정보
router.get("/get_users_join_course", getUsersJoinCourse); // 전체유저와 코스 조인
router.get("/get_course", getCourse); // 컨트롤러 함수 연결 - :은 정해지지 않은 문자열 표시
router.get("/get_facilities", getFacilities); // 편의시설 위치 api

module.exports = router; // router 모듈 내보내기
