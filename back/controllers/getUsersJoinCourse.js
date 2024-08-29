const database = require("../database/database");

exports.getUsersJoinCourse = async (req, res) => {
  try {
    const result = await database.query(
      "select *, users_table.url as user_url, images_table.url as img_url from running_course_table join images_table on running_course_table.course_id = images_table.course_id join users_table on users_table.user_table_idx = running_course_table.user_id order by created_at desc"
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
