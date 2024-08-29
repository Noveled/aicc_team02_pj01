const database = require("../database/database");

exports.getUserJoinCourse = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await database.query(
      "select * from users_table join running_course_table on users_table.user_table_idx = running_course_table.user_id where users_table.user_id = $1",
      [userId]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
