const dotenv = require("dotenv");
dotenv.config({
  path: process.env.DOTENV_PATH || ".env",
});

const dbDialect = "postgres"; 

module.exports = {
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: dbDialect,
    dialectModule: require("pg"), 
  },
  server: {
    baseUrl: process.env.SERVER_BASE_URL,
    port: parseInt(process.env.SERVER_PORT) || 5001,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  llm: {
    gemini: process.env.GEMINI_API_KEY,
    openRouter: process.env.OPENROUTER_API_KEY,
  },
};
