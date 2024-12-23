import Redis from 'ioredis';

import config from '../configs/config.js';

const redisClient = new Redis({
  host: config.REDIS.host || 'redis',
  port: config.REDIS.port || 6379,
  retryStrategy(times) {
    return Math.min(times * 50, 2000); // Reconnect logic
  },
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

export default {
  redisClient: redisClient,
};
