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

export default {
  sanitizeSqlResult: sanitizeSqlResult,
  addDays: addDays,
  generateRandom: generateRandom,
};
