import wrapperService from '../services/wrapper.js';
import urlsService from '../services/urls.js';

const shortenUrl = async (req, res) => {
  if (!req.body.longUrl) {
    throw new Error('input_missing');
  }

  let shortenUrlParams = {};
  shortenUrlParams.longUrl = req.body.longUrl;
  shortenUrlParams.userId = req._user.id;
  req.body.alias ? (shortenUrlParams.alias = req.body.alias) : null;
  req.body.topic ? (shortenUrlParams.topic = req.body.topic) : null;

  let result = await urlsService.shortenUrl(shortenUrlParams);

  return res.json(result);
};

export default {
  shortenUrl: wrapperService.wrap(shortenUrl),
};
