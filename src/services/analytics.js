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

  let clicksByDateParams = {};
  clicksByDateParams.urlId = urlData.data.urlData.id;

  let clicksByDate = await analyticsModel.getClicksByDate(clicksByDateParams);
  analytics.clicksByDate = clicksByDate.map((record) => ({
    date: record.date,
    clicks: parseInt(record.clicks),
  }));

  let clicksByOsTypeParams = {};
  clicksByOsTypeParams.urlId = urlData.data.urlData.id;

  let clicksByOsType =
    await analyticsModel.getClicksByosType(clicksByOsTypeParams);
  analytics.osType = clicksByOsType.map((record) => ({
    osType: record.osType,
    uniqueclicks: parseInt(record.uniqueClicks),
    uniqueUsers: parseInt(record.uniqueUsers),
  }));

  let clicksByDeviceTypeParams = {};
  clicksByDeviceTypeParams.urlId = urlData.data.urlData.id;

  let clicksByDeviceType = await analyticsModel.getClicksByDeviceType(
    clicksByDeviceTypeParams,
  );
  analytics.deviceType = clicksByDeviceType.map((record) => ({
    deviceType: record.deviceType,
    uniqueclicks: parseInt(record.uniqueClicks),
    uniqueUsers: parseInt(record.uniqueUsers),
  }));

  let response = status.getStatus('success');
  response.data = {};
  response.data.analytics = analytics;

  return response;
};

const topicAnalytics = async (params) => {
  if (!params.topic) {
    throw new Error('input_missing');
  }

  let topicAnalytics = {};

  let totalClicksOnTopicParams = {};
  totalClicksOnTopicParams.topic = params.topic;

  let totalClicksOnTopic = await analyticsModel.getTotalClicksData(
    totalClicksOnTopicParams,
  );
  topicAnalytics.totalClicks = parseInt(totalClicksOnTopic.totalClicks);

  let totalDistinctClicksOnTopicParams = {};
  totalDistinctClicksOnTopicParams.topic = params.topic;
  totalDistinctClicksOnTopicParams.distinct = true;

  let totalDistinctCLicksOnTopic = await analyticsModel.getTotalClicksData(
    totalDistinctClicksOnTopicParams,
  );
  topicAnalytics.uniqueClicks = parseInt(
    totalDistinctCLicksOnTopic.uniqueClicks,
  );

  let allUrlsDataOnTopicParams = {};
  allUrlsDataOnTopicParams.topic = params.topic;

  let allUrlsDataOnTopic = await analyticsModel.getAllUrlsData(
    allUrlsDataOnTopicParams,
  );
  topicAnalytics.urls = allUrlsDataOnTopic.map((record) => ({
    shortUrl: record.shortUrl,
    totalClicks: parseInt(record.totalClicks),
    uniqueClicks: parseInt(record.uniqueClicks),
  }));

  let response = status.getStatus('success');
  response.data = {};
  response.data.topicAnalytics = topicAnalytics;

  return response;
};

const createClick = async (params) => {
  if (
    !params.ipAddress ||
    !params.urlId ||
    !params.userId ||
    !params.osType ||
    !params.deviceType
  ) {
    throw new Error('input_missing');
  }

  let createClickParams = {};
  createClickParams.ipAddress = params.ipAddress;
  createClickParams.urlId = params.urlId;
  createClickParams.userId = params.userId;
  createClickParams.osType = params.osType;
  createClickParams.deviceType = params.deviceType;

  const click = await analyticsModel.createClick(createClickParams);

  return click;
};

export default {
  analytics: wrapperService.wrap(analytics),
  createClick: wrapperService.wrap(createClick),
  topicAnalytics: wrapperService.wrap(topicAnalytics),
};
