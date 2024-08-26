const router = require('express').Router(); 
const { deleteCourse } = require('../controllers/deleteCourse');

router.delete('/delete_course/:courseId', deleteCourse); 

module.exports = router; 