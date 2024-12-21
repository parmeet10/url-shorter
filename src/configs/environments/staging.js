import Knex from 'knex';

const postgresConnectionString = {
  connectionString: '',
  host: '',
  port: '',
  user: '',
  password: '',
};

const KNEX_CONFIG = {
  client: 'pg',
  connection: postgresConnectionString,
};

const knex = Knex(KNEX_CONFIG);

const AUTH = {
  TEST_TOKEN: null,
  SESSION_EXPIRY_EXTEND_DAYS: 90,
};

const OAUTH = {
  GOOGLE: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    CALLBACK_URL: 'http://localhost:3000/auths/verify/google',
    SCOPE: ['profile', 'email'],
  },
};

const config = {
  knex: knex,
  AUTH: AUTH,
  OAUTH,
};

export default config;
