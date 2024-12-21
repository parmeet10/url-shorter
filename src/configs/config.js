import common from './environments/common.js';
import devEnvironment from './environments/development.js';
import stageEnvironment from './environments/staging.js';
import prodEnvironment from './environments/production.js';
import testEnvironment from './environments/testing.js';

const environments = {
  production: prodEnvironment,
  staging: stageEnvironment,
  testing: testEnvironment,
  development: devEnvironment,
};

const currentEnv = process.env.NODE_ENV;
const environment = environments[currentEnv] || devEnvironment;

const config = {
  ...common,
  ...environment,
};

export default config;
