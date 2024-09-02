const database = require("../database/database");

exports.get1course = async (req, res) => {
  const course_id = req.params.course_id;

  try {
    const result = await database.query(
      "select * from running_course_table where course_id = $1",
      [course_id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
