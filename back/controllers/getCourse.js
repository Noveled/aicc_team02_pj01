const database = require("../database/database"); // database.js import

exports.getCourse = async (req, res) => {
  const userId = req.query.userId; // 유저 아이디
  const isMarathon = req.query.isMarathon; // 마라톤 코스 여부
  const isVisible = req.query.isVisible; // 검색 가능 여부(삭제 여부)
  const values = [];

  // 기본 SQL 쿼리
  let query = `
    SELECT p.*, i.url AS thumbnail_id
    FROM running_course_table p
    LEFT JOIN images_table i ON p.course_id = i.course_id AND i.is_primary = TRUE
    WHERE 1=1
  `;

  // userId가 존재하는 경우 query 추가
  if (userId) {
    query += ` AND p.user_id = $${values.length + 1}`;
    values.push(userId);
  }

  // isMarathon 존재하는 경우 query 추가
  if (isMarathon) {
    query += ` AND p.is_marathon = $${values.length + 1}`;
    values.push(isMarathon);
  }

  // isVisible 존재하는 경우 query 추가
  if (isVisible) {
    query += ` AND p.is_visible = $${values.length + 1}`;
    values.push(isVisible);
  }

  try {
    const result = await database.query(query, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
