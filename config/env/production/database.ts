import { parse } from "pg-connection-string";
const config = parse(process.env.DATABASE_URL);
export default ({ env }) => ({
  connection: {
    client: "postgres",
    debug: false,
    connection: {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    useNullAsDefault: true,
  },
});
