require("dotenv").config();

const { faker } = require("@faker-js/faker");
const { execSql } = require("./db/query");

const GENERETE_ITEMS_SIZE = 40_000_000;
const BATCH_SIZE = 1000;

const getBatchSize = () => {
  if (!process.argv.includes("--batch-size")) return BATCH_SIZE;

  const batchSize = Number(
    process.argv[process.argv.indexOf("--batch-size") + 1]
  );
  if (!Number.isInteger(batchSize)) {
    console.error("Invalid batch size: ", batchSize);
    process.exit(1);
  }

  return batchSize;
};

console.log(process.argv);

const getItemsSize = () => {
  if (!process.argv.includes("--items-size")) return GENERETE_ITEMS_SIZE;

  const itemsSize = Number(
    process.argv[process.argv.indexOf("--items-size") + 1]
  );
  if (!Number.isInteger(itemsSize)) {
    console.error("Invalid items size: ", itemsSize);
    process.exit(1);
  }

  return itemsSize;
};

const genUserData = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    dob: faker.date.birthdate(),
  };
};

const createTable = async () => {
  console.log("create table");
  const sql = `CREATE TABLE IF NOT EXISTS users(
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255),
        email varchar(255),
        dob DATE NOT NULL,
        PRIMARY KEY(id)
    );`;

  const result = await execSql(sql);
  console.log("CREATE TABLE: ", result);
};

const insertItems = async (items = BATCH_SIZE) => {
  const sql = `INSERT INTO users(name, email, dob) VALUES ${Array(items)
    .fill("(?, ?, ?)")
    .join(", ")};`;
  const params = Array.from({ length: items }, () => {
    const { name, email, dob } = genUserData();
    return [name, email, dob];
  }).flat();

  await execSql(sql, params);
};

const main = async () => {
  await createTable();
  const size = getItemsSize();
  let remainItems = size;
  const batchSize = getBatchSize();
  const start = performance.now();
  console.log("Inserting: ", remainItems, " batch size: ", batchSize);
  while (remainItems > 0) {
    const items = remainItems > batchSize ? batchSize : remainItems;
    console.log("insert items: ", items, " remain: ", remainItems);
    await insertItems(batchSize);
    remainItems -= items;
  }

  console.log("inserted: ", size, "time: ", performance.now() - start, " ms");

  process.exit(0);
};

main();
