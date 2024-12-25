import Knex from 'knex';

const postgresConnectionString = {
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

const REDIS = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

const KNEX_CONFIG = {
  client: 'pg',
  connection: postgresConnectionString,
};

const SERVER = {
  hostName: process.env.DEVELOPMENT_HOST,
};

const knex = Knex(KNEX_CONFIG);

const AUTH = {
  TEST_TOKEN: null,
  SESSION_EXPIRY_EXTEND_DAYS: 90,
};

const OAUTH = {
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    SCOPE: ['profile', 'email'],
  },
};

const config = {
  knex: knex,
  AUTH: AUTH,
  OAUTH: OAUTH,
  REDIS: REDIS,
  SERVER: SERVER,
};

export default config;
