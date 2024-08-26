require("dotenv").config();

const { execSql } = require("./db/query");

const test = async () => {
  const params = [
    ["SELECT * FROM users WHERE dob > ? limit 1000;", ["2000-01-01"]],
    ["SELECT * FROM users WHERE dob = ? limit 1000;", ["2000-01-01"]],
    ["SELECT * FROM users WHERE dob < ? limit 1000;", ["2000-01-01"]],
    ["SELECT * FROM users WHERE name LIKE ? limit 1000;", ["%Jhon%"]],
  ];

  for (const [sql, param] of params) {
    await execSql(sql, param);
  }
};

(async () => {
  await test();
  process.exit(0);
})();
