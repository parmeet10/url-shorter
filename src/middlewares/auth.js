import defaultUserAgent from 'default-user-agent';

import wrapperService from '../services/wrapper.js';
import authsService from '../services/auth.js';

const middleware = async (req, res, next) => {
  let skip = false;
  console.log(`${req.method}: ${req.path}`);
  // ON HOLD TILL FURTHER NOTICE
  // if (
  //   !req.headers['x-device-id'] ||s
  //   !req.headers['x-origin'] ||
  //   !req.headers['x-platform'] ||
  //   !req.headers['x-version']
  // ) {
  //   throw new Error('headers_missing');
  // }

  const whitelistedRoutes = [
    {
      methods: ['GET'],
      uri: /\/auths\/providers$/,
    },
    {
      methods: ['POST'],
      uri: /\/auths\/requests$/,
    },
    {
      methods: ['POST'],
      uri: /\/auths\/verify$/,
    },
    {
      methods: ['GET'],
      uri: /\/auths\/requests\/social$/,
    },
    {
      methods: ['GET'],
      uri: /\/auths\/verify\/(google)$/,
    },
  ];

  whitelistedRoutes.forEach((route) => {
    if (
      route.uri.test(req.originalUrl.split('?')[0]) &&
      route.methods.includes(req.method)
    ) {
      skip = true;
    }
  });

  if (skip) {
    return next();
  }

  // TODO: Remove this from here and uncomment at top
  if (
    !req.headers['x-device-id'] ||
    !req.headers['x-origin'] ||
    !req.headers['x-platform'] ||
    !req.headers['x-version']
  ) {
    throw new Error('headers_missing');
  }

  if (!req.headers['x-auth']) {
    throw new Error('headers_missing');
  }
  let authParams = {};
  authParams.originId = parseInt(req.headers['x-origin']);
  authParams.platformId = parseInt(req.headers['x-platform']);
  authParams.identifier = req.headers['x-device-id'];
  authParams.version = parseInt(req.headers['x-version']);
  authParams.token = req.headers['x-auth'];
  authParams.userAgent = req.headers['User-Agent']
    ? req.headers['User-Agent']
    : defaultUserAgent();

  let result = await authsService.validateSession(authParams);

  if (!result || result.code !== 'success') {
    throw new Error('authn_fail');
  }

  req._user = {};
  req._user.id = parseInt(result.data.user.id);
  req._user.roleId = parseInt(result.data.user.role_id);
  req._user.email = result.data.user.email;

  return next();
};

export default wrapperService.wrap(middleware);
