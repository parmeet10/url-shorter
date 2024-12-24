import config from '../configs/config.js';
import wrapperService from '../services/wrapper.js';
// import utilsService from '../services/utils.js';

const createClick = async (params) => {
  if (!params.urlId || !params.ipAddress || !params.userId) {
    throw new Error('input_missing');
  }
  let _insert = {
    url_id: params.urlId,
    user_id: params.userId || null,
    ip_address: params.ipAddress,
  };

  let result = await config.knex('clicks').insert(_insert).returning('id');

  return result[0];
};

export default {
  createClick: wrapperService.wrap(createClick),
};
