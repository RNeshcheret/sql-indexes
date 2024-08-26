const { getConnection, releaseConnection } = require("./connection");

const execSql = async (sql, params) => {
  const connection = await getConnection();

  try {
    const start = performance.now();
    const result = await connection.execute(sql, params);
    console.log(
      "SQL: ",
      sql,
      params?.length ? " params: " + JSON.stringify(params) + ", " : "",
      " time: ",
      performance.now() - start,
      " ms"
    );
    return result;
  } catch (error) {
    console.log("SQL: ", sql, "params: ", params);
    console.error(error);
    throw error;
  } finally {
    releaseConnection(connection);
  }
};

module.exports = { execSql };
