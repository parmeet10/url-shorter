import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const sanitizeSqlResult = (result) => {
  return JSON.parse(JSON.stringify(result));
};

const addDays = (date, numberOfDays) => {
  return moment(date).add(numberOfDays, 'days');
};

const generateRandom = () => {
  return uuidv4().replace(/-/g, '');
};

const encodebase62 = (number) => {
  const BASE62_CHARS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let encoded = '';
  
  while (number > 0) {
    const remainder = number % 62;
    encoded = BASE62_CHARS[remainder] + encoded;
    number = Math.floor(number / 62);
  }
  return encoded;
};

export default {
  sanitizeSqlResult: sanitizeSqlResult,
  addDays: addDays,
  generateRandom: generateRandom,
  encodebase62: encodebase62,
};
