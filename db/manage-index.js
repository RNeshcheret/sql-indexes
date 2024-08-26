require("dotenv").config();

// const { getConnection, releaseConnection } = require("./connection");
const { execSql } = require("./query");

const DROP_INDEX = process.argv.includes("--drop");
const CREATE_INDEX = process.argv.includes("--create");
const INDEX_NAME = "idx_dob";

const dropIndex = async () => {
  const sql = `ALTER TABLE users DROP INDEX ${INDEX_NAME};`;
  const result = await execSql(sql);
  console.log("DROP INDEX: ", result);
};

const createIndex = async () => {
  const indexType = process.argv.includes("hash") ? "hash" : "btree";
  const sql = `ALTER TABLE users ADD INDEX ${INDEX_NAME} (dob) using ${indexType};`;
  const result = await execSql(sql);
  console.log("CREATE INDEX: ", result, "indexType: ", indexType);
};

const stop = () => {
  process.exit(0);
};

(async () => {
  if (DROP_INDEX) {
    await dropIndex();
    stop();
  }
  if (CREATE_INDEX) {
    await createIndex();
    stop();
  }

  console.warn("set --drop or --create");
  stop();
})();
