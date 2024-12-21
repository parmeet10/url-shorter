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

const AWS = {
  SES: {
    ACCESS_KEY_ID: '',
    SECRET_ACCESS_KEY: '',
    REGION: '',
  },
};

const AUTH = {
  TEST_TOKEN: null,
  OTP: {
    SENDER_EMAIL: '',
    SUBJECT: 'Log in to fitXperts',
  },
  SESSION_EXPIRY_EXTEND_DAYS: 90,
};

const config = {
  knex: knex,
  AUTH: AUTH,
  AWS: AWS,
};

export default config;
