import Redis from 'ioredis';

import config from '../configs/config.js';

const redisClient = new Redis({
  host: config.REDIS.host || 'redis',
  port: config.REDIS.port || 6379,
  retryStrategy() {
    const delay = 60000;
    console.log(`Retrying connection to Redis in ${delay / 1000} seconds.`);
    return delay; // Reconnect delay
  },
  connectTimeout: 1000,
  timeout: 1000,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});

async function setValueInRedis(key, value, expirationInSeconds = 10) {
  try {
    const result = await Promise.race([
      redisClient.set(key, value, 'EX', expirationInSeconds),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), 2000),
      ),
    ]);
    console.log('Value set in Redis:', result);
  } catch (err) {
    console.log('Failed to write in Redis:', err);
  }
}

async function getValueFromRedis(key) {
  try {
    const result = await Promise.race([
      redisClient.get(key),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), 2000),
      ),
    ]);
    console.log('Value retrieved from Redis:', result);
    return result;
  } catch (err) {
    console.log('Failed to retrieve value from Redis:', err);
    return null;
  }
}

export default {
  setValueInRedis: setValueInRedis,
  getValueFromRedis: getValueFromRedis,
  redisClient: redisClient,
};
