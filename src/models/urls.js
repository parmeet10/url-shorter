import config from '../configs/config.js';
import wrapperService from '../services/wrapper.js';
import utilsService from '../services/utils.js';

const getUrl = async (params) => {
  if (!params.shortUrl && !params.longUrl && !params.alias) {
    throw new Error('input_missing');
  }

  let getUrlQuery = config.knex
    .select('u.id')
    .select('u.user_id')
    .select('u.short_url')
    .select('u.long_url')
    .select('u.topic')
    .select('u.alias')
    .select('u.active')
    .select('u.created_at')
    .from('urls as u')
    .where('u.active', 1);

  params.shortUrl ? getUrlQuery.where('u.short_url', params.shortUrl) : null;
  params.longUrl ? getUrlQuery.where('u.long_url', params.longUrl) : null;
  params.alias ? getUrlQuery.orWhere('u.alias', params.alias) : null;

  let result = await getUrlQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

const createUrl = async (params) => {
  if (!params.longUrl || !params.userId) {
    throw new Error('input_missing');
  }

  let _insert = {
    long_url: params.longUrl,
    short_url: params.shortUrl,
    user_id: params.userId,
  };

  params.topic ? (_insert['topic'] = params.topic) : null;
  params.alias ? (_insert['alias'] = params.alias) : null;
  params.shortUrl ? (_insert['short_url'] = params.shortUrl) : null;

  let result = await config
    .knex('urls')
    .insert(_insert)
    .returning(['id', 'short_url', 'created_at']);

  return result[0];
};

const updateUrl = async (params) => {
  if (!params.urlId) {
    throw new Error('input_missing');
  }

  let _update = { updated_at: new Date() };
  params.shortUrl ? (_update['short_url'] = params.shortUrl) : null;
  params['active'] ? (_update['active'] = params.active) : null;

  let updateUrlQuery = config.knex('urls').update(_update);

  params.urlId ? updateUrlQuery.where('id', params.urlId) : null;

  updateUrlQuery.returning(['id', 'short_url', 'created_at']);

  let result = await updateUrlQuery;

  return result[0];
};

export default {
  getUrl: wrapperService.wrap(getUrl),
  createUrl: wrapperService.wrap(createUrl),
  updateUrl: wrapperService.wrap(updateUrl),
};
