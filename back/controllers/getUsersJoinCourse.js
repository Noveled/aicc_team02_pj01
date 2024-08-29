const database = require("../database/database");

exports.getUsersJoinCourse = async (req, res) => {
  try {
    const result = await database.query(
      "select * from users_table join running_course_table on users_table.user_table_idx = running_course_table.user_id"
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
