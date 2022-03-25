module.exports = {
  type: "mysql",
  host: process.env.DATABASE_CONTAINER_NAME,
  port: 3306,
  username: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity.js"],
  migrationsTableName: "migrations",
  migrationsTableName: "migrations",
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
  synchronize: process.env.DB_SYNC === "true",
};
