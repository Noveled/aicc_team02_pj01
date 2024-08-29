const database = require("../database/database");

exports.getUsers = async (req, res) => {
  try {
    const result = await database.query("select * from users_table");
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
