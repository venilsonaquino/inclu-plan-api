export default () => ({
  port: Number.parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
