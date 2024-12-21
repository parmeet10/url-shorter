import Redis from 'ioredis';

const redisClient = new Redis({
  host: '127.0.0.1', // Default Redis host
  port: 6379, // Default Redis port
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
