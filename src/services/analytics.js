import wrapperService from '../services/wrapper.js';

import analyticsModel from '../models/analytics.js';

const analytics = (params) => {
  if (!params.shortUrl) {
    throw new Error('input_missing');
  }
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
