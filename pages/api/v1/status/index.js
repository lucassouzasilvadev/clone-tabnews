import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dataBaseVersionResult = await database.query("SHOW server_version");
  const dataBaseVersion = dataBaseVersionResult.rows[0].server_version;
  const dataBaseMaxConnectionResult = await database.query(
    "SHOW max_connections",
  );
  const dataBaseMaxConnectionsValue =
    dataBaseMaxConnectionResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const dataBaseOpennedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dataBaseVersion,
        max_connections: parseInt(dataBaseMaxConnectionsValue),
        opened_connections: dataBaseOpennedConnectionResult.rows[0].count,
      },
    },
  });
}

export default status;
