import status from '../configs/status.js';

import wrapperService from './wrapper.js';
import utilsService from './utils.js';
import redisService from '../services/redis.js';

import urlsModel from '../models/urls.js';

const shortenUrl = async (params) => {
  if (!params.longUrl) {
    throw new Error('input_missing');
  }

  let existingUrlParams = {};
  existingUrlParams.longUrl = params.longUrl;
  params.alias ? (existingUrlParams.alias = params.alias) : null;

  let existingUrl = await urlsModel.getUrl(existingUrlParams);

  if (existingUrl) {
    if (existingUrl.long_url == params.longUrl) {
      let response = status.getStatus('success');
      response.data = {};
      response.data.urlData = {};
      response.data.urlData.short_url = existingUrl.short_url;
      response.data.urlData.created_at = existingUrl.created_at;

      return response;
    }
    if (existingUrl.alias !== null && existingUrl.long_url !== params.longUrl) {
      throw new Error('alias_exists');
    }
  }

  let url;
  if (params.alias) {
    let urlParams = {};
    urlParams.longUrl = params.longUrl;
    urlParams.alias = params.alias;
    urlParams.shortUrl = `/api/shorten/${params.alias}`;
    urlParams.userId = params.userId;
    params.topic ? (urlParams.topic = params.topic) : null;

    url = await urlsModel.createUrl(urlParams);
    delete url.id;

    await redisService.setValueInRedis(`long:${params.longUrl}`, url.short_url);
    await redisService.setValueInRedis(
      `short:${url.short_url}`,
      params.longUrl,
    );
  } else {
    let urlParams = {};
    urlParams.longUrl = params.longUrl;
    urlParams.alias = params.alias;
    urlParams.userId = params.userId;
    params.topic ? (urlParams.topic = params.topic) : null;

    url = await urlsModel.createUrl(urlParams);

    let shortUrl = utilsService.encodebase62(parseInt(url.id));

    let updateUrlParams = {};
    updateUrlParams.urlId = parseInt(url.id);
    updateUrlParams.shortUrl = `/api/shorten/${shortUrl.toString()}`;

    url = await urlsModel.updateUrl(updateUrlParams);
    delete url.id;

    await redisService.setValueInRedis(`long:${params.longUrl}`, url.short_url);
    await redisService.setValueInRedis(
      `short:${url.short_url}`,
      params.longUrl,
    );
  }

  let response = status.getStatus('success');
  response.data = {};
  response.data.urlData = url;

  return response;
};

const urlRedirector = async (params) => {
  if (!params.shortUrl) throw new Error('input_missing');

  let urlData = await redisService.getValueFromRedis(
    `short:${params.shortUrl}`,
  );

  if (!urlData) {
    let urlDataParams = {};
    urlDataParams.shortUrl = params.shortUrl;

    urlData = await urlsModel.getUrl(urlDataParams);
  }

  if (!urlData) {
    throw new Error('resource_missing');
  }

  let response = status.getStatus('success');
  response.data = {};
  response.data.urlData = urlData;

  return response;
};

export default {
  shortenUrl: wrapperService.wrap(shortenUrl),
  urlRedirector: wrapperService.wrap(urlRedirector),
};
