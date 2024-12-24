import config from '../configs/config.js';

import wrapperService from '../services/wrapper.js';
import utilsService from '../services/utils.js';

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

const getClicksCount = async (params) => {
  if (!params.urlId && params.id) {
    throw new Error('input_missing');
  }

  let getClicksQuery = config.knex.from('clicks as c');

  params.distinct
    ? getClicksQuery.countDistinct('c.ip_address as count')
    : getClicksQuery.count('c.id as count');
  params.urlId ? getClicksQuery.where('c.url_id', params.urlId) : null;
  params.id ? getClicksQuery.where('c.id', params.id) : null;

  let result = await getClicksQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

export default {
  createClick: wrapperService.wrap(createClick),
  getClicksCount: wrapperService.wrap(getClicksCount),
};
