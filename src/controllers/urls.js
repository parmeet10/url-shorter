import { UAParser } from 'ua-parser-js';

import wrapperService from '../services/wrapper.js';
import urlsService from '../services/urls.js';

const shortenUrl = async (req, res) => {
  if (!req.body.longUrl) {
    throw new Error('input_missing');
  }

  let longUrl;
  try {
    longUrl = new URL(req.body.longUrl);
  } catch (e) {
    throw new Error('invalid_url', e);
  }

  let shortenUrlParams = {};
  shortenUrlParams.longUrl = longUrl.href;
  shortenUrlParams.userId = req._user.id;
  req.body.alias ? (shortenUrlParams.alias = req.body.alias) : null;
  req.body.topic &&
  ['acquisition', 'activation', 'retention'].includes(req.body.topic)
    ? (shortenUrlParams.topic = req.body.topic)
    : (shortenUrlParams.topic = 'unknown');

  let result = await urlsService.shortenUrl(shortenUrlParams);

  return res.json(result);
};

const urlRedirector = async (req, res) => {
  if (!req.params.alias) {
    throw new Error('input_missing');
  }

  const userAgent = new UAParser(req.headers['user-agent']);

  const urlRedirectorParams = {};
  urlRedirectorParams.shortUrl = req.params.alias;
  urlRedirectorParams.userId = req._user.id;
  req.ip == '::1'
    ? (urlRedirectorParams.ipAddress = '127.0.0.1')
    : (urlRedirectorParams.ipAddress = req.ip);
  urlRedirectorParams.osType = userAgent.getOS().name || 'unknown os';
  urlRedirectorParams.deviceType =
    userAgent.getDevice().type || 'unknown device';

  let result = await urlsService.urlRedirector(urlRedirectorParams);

  if (result.error) return res.json(result);
  else return res.redirect(result.data.urlData.long_url);
};

export default {
  shortenUrl: wrapperService.wrap(shortenUrl),
  urlRedirector: wrapperService.wrap(urlRedirector),
};
