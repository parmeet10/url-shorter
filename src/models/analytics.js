import config from '../configs/config.js';

import wrapperService from '../services/wrapper.js';
import utilsService from '../services/utils.js';

const createClick = async (params) => {
  if (
    !params.urlId ||
    !params.ipAddress ||
    !params.userId ||
    !params.osType ||
    !params.deviceType
  ) {
    throw new Error('input_missing');
  }
  let _insert = {
    url_id: params.urlId,
    user_id: params.userId || null,
    ip_address: params.ipAddress,
    os_type: params.osType,
    device_type: params.deviceType,
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

const getClicksByDate = async (params) => {
  if (!params.urlId) {
    throw new Error('input_missing');
  }

  const clicksByDateQuery = await config.knex
    .select(config.knex.raw('DATE(created_at) as date'))
    .count('c.id as clicks')
    .where('c.url_id', params.urlId)
    .andWhere(
      'created_at',
      '>=',
      config.knex.raw("CURRENT_DATE - INTERVAL '7 days'"),
    )
    .groupByRaw('DATE(created_at)')
    .from('clicks as c');

  const result = await clicksByDateQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result);
};

const getClicksByosType = async (params) => {
  if (!params.urlId) {
    throw new Error('input_missing');
  }

  const clicksByOsTypeQuery = config.knex
    .select('c.os_type as osType')
    .countDistinct('c.id as uniqueClicks')
    .countDistinct('c.user_id as uniqueUsers')
    .where('c.url_id', params.urlId)
    .groupBy('os_type')
    .from('clicks as c');

  let result = await clicksByOsTypeQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result);
};

const getClicksByDeviceType = async (params) => {
  if (!params.urlId) {
    throw new Error('input_missing');
  }

  const clicksByDeviceTypeQuery = config.knex
    .select('c.device_type as deviceType')
    .countDistinct('c.id as uniqueClicks')
    .countDistinct('c.user_id as uniqueUsers')
    .where('c.url_id', params.urlId)
    .groupBy('device_type')
    .from('clicks as c');

  let result = await clicksByDeviceTypeQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result);
};

const getTotalClicksData = async (params) => {
  const totalClicksDataQuery = config.knex
    .from('clicks as c')
    .join('urls as u', { 'u.id': 'c.url_id' });

  params.topic ? totalClicksDataQuery.where('u.topic', params.topic) : null;
  params.distinct
    ? totalClicksDataQuery.countDistinct('c.user_id as uniqueClicks')
    : totalClicksDataQuery.count('c.id as totalClicks');

  const result = await totalClicksDataQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

const getAllUrlsData = async (params) => {
  const allUrlsDataQuery = config.knex
    .select('u.short_url as shortUrl')
    .join('clicks as c', { 'c.url_id': 'u.id' })
    .count('c.id as totalClicks')
    .countDistinct('c.user_id as uniqueClicks')
    .groupBy('u.short_url')
    .from('urls as u');

  params.topic ? allUrlsDataQuery.where('u.topic', params.topic) : null;
  console.log(allUrlsDataQuery.toString());
  const result = await allUrlsDataQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result);
};

export default {
  createClick: wrapperService.wrap(createClick),
  getClicksCount: wrapperService.wrap(getClicksCount),
  getClicksByDate: wrapperService.wrap(getClicksByDate),
  getClicksByosType: wrapperService.wrap(getClicksByosType),
  getClicksByDeviceType: wrapperService.wrap(getClicksByDeviceType),
  getTotalClicksData: wrapperService.wrap(getTotalClicksData),
  getAllUrlsData: wrapperService.wrap(getAllUrlsData),
};
