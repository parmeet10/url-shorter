import status from '../configs/status.js';

import wrapperService from './wrapper.js';
import utilsService from './utils.js';
import redisService from '../services/redis.js';

import urlsModel from '../models/urls.js';
import config from '../configs/config.js';

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
      await redisService.setValueInRedis(
        `long:${existingUrl.long_url}`,
        existingUrl.short_url,
      );
      await redisService.setValueInRedis(
        `short:${existingUrl.short_url}`,
        existingUrl.long_url,
      );

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
    urlParams.shortUrl = `${config.SERVER.hostName}/api/shorten/${params.alias}`;
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
    updateUrlParams.shortUrl = `${config.SERVER.hostName}/api/shorten/${shortUrl.toString()}`;

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

  let urlData = {};
  urlData.long_url = await redisService.getValueFromRedis(
    `short:${config.SERVER.hostName}/api/shorten/${params.shortUrl}`,
  );

  if (!urlData.long_url) {
    let urlDataParams = {};
    urlDataParams.shortUrl = `${config.SERVER.hostName}/api/shorten/${params.shortUrl}`;

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
