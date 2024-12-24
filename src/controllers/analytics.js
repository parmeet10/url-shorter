import wrapperService from '../services/wrapper.js';

import analyticsService from '../services/analytics.js';

const analytics = async (req, res) => {
  if (!req.params.alias) {
    throw new Error('input_missing');
  }

  const analyticsParams = {};
  analyticsParams.shortUrl = req.params.alias;

  let result = await analyticsService.analytics(analyticsParams);
  return res.json(result);
};

export default {
  analytics: wrapperService.wrap(analytics),
};
