import wrapperService from '../services/wrapper.js';
import urlsService from './urls.js';

import analyticsModel from '../models/analytics.js';

import status from '../configs/status.js';
import config from '../configs/config.js';

const analytics = async (params) => {
  if (!params.shortUrl) {
    throw new Error('input_missing');
  }

  let getUrlDataParams = {};
  getUrlDataParams.shortUrl = `${config.SERVER.hostName}/api/shorten/${params.shortUrl}`;

  const urlData = await urlsService.getUrlData(getUrlDataParams);

  if (!urlData.data.urlData) {
    throw new Error('url_missing');
  }

  let analytics = {};

  let totalClicksParams = {};
  totalClicksParams.urlId = urlData.data.urlData.id;

  let totalClicks = await analyticsModel.getClicksCount(totalClicksParams);
  analytics.totalClicks = parseInt(totalClicks.count);

  let uniqueClicksParams = {};
  uniqueClicksParams.urlId = urlData.data.urlData.id;
  uniqueClicksParams.distinct = true;

  let uniqueClicks = await analyticsModel.getClicksCount(uniqueClicksParams);
  analytics.uniqueClicks = parseInt(uniqueClicks.count);

  let response = status.getStatus('success');
  response.data = {};
  response.data.analytics = analytics;

  return response;
};

const createClick = async (params) => {
  if (!params.ipAddress || !params.urlId || !params.userId) {
    throw new Error('input_missing');
  }

  let createClickParams = {};
  createClickParams.ipAddress = params.ipAddress;
  createClickParams.urlId = params.urlId;
  createClickParams.userId = params.userId;

  const click = await analyticsModel.createClick(createClickParams);

  return click;
};

export default {
  analytics: wrapperService.wrap(analytics),
  createClick: wrapperService.wrap(createClick),
};
