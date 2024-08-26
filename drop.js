require("dotenv").config();
const { execSql } = require("./db/query");

const dropTable = async () => {
  const sql = `DROP TABLE IF EXISTS users;`;
  const result = await execSql(sql);
  console.log("DROP TABLE: ", result);
};

(async () => {
  await dropTable();
})();
