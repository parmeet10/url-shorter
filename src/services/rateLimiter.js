import moment from 'moment';

const store = new Map();

class RateLimiter {
  // expiresIn SHOULD BE IN SECONDS
  constructor(expiresIn, count) {
    if (expiresIn < 1 || count < 1) {
      throw new Error('Duration and count must have positive values');
    }

    this.expiresIn = expiresIn;
    this.count = count;
    this.clearStoreExpiredDump();
  }

  checkLimit(key) {
    console.log(store);
    if (store.has(key)) {
      const keyInfo = store.get(key);
      const now = moment().unix();

      if (keyInfo.expiresOn <= now) {
        store.set(key, {
          count: 1,
          expiresOn: now + this.expiresIn, // Set new expiry time in seconds
        });

        return true;
      } else if (keyInfo.count >= this.count && keyInfo.expiresOn > now) {
        return false;
      } else if (keyInfo.count < this.count && keyInfo.expiresOn > now) {
        store.set(key, {
          count: keyInfo.count + 1,
          expiresOn: keyInfo.expiresOn, // Keep the same expiry time
        });

        return true;
      }
    } else {
      store.set(key, {
        count: 1,
        expiresOn: moment().unix() + this.expiresIn, // Set expiry time in seconds
      });

      return true;
    }
    return true;
  }

  clearStoreExpiredDump() {
    setInterval(() => {
      const now = moment().unix();
      store.forEach((data, key) => {
        if (data.expiresOn < now - this.expiresIn * 3) {
          // Adjusted for seconds
          store.delete(key);
        }
      });
    }, 21600000); // 6 hours in milliseconds
  }
}

export default RateLimiter;
