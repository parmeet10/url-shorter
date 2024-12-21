import defaultUserAgent from 'default-user-agent';

import config from '../configs/config.js';
import passport from '../middlewares/passport.js';
import status from '../configs/status.js';

import utilsService from './utils.js';
import wrapperService from './wrapper.js';

import usersModel from '../models/users.js';
import authsModel from '../models/auths.js';

const getProviders = async () => {
  let providerParams = {};
  let providers = await authsModel.getProviders(providerParams);

  let response = status.getStatus('success');
  response.data = {};
  response.data.providers = providers;

  return response;
};

const createAuthenticationRequest = async (params) => {
  if (!params.providerId) {
    throw new Error('input_missing');
  }

  let providerParams = {};
  providerParams.providerId = params.providerId;
  let providers = await authsModel.getProviders(providerParams);

  if (!providers || providers.length === 0) {
    throw new Error('provider_missing');
  }

  let provider = providers[0];

  if (!params.state) {
    throw new Error('input_missing');
  }

  let authenticationRequestParams = {};
  authenticationRequestParams.providerId = params.providerId;
  authenticationRequestParams.reference = utilsService.generateRandom();
  authenticationRequestParams.state = params.state;
  authenticationRequestParams.verified = 0;
  authenticationRequestParams.expiry = new Date(
    new Date().setMinutes(new Date().getMinutes() + 5),
  );

  await authsModel.createAuthenticationRequest(authenticationRequestParams);

  let oauthMiddleware = passport.authenticate(provider.code, {
    state: params.state,
  });

  return oauthMiddleware;
};

const validateSession = async (params) => {
  if (
    !params.originId ||
    !params.platformId ||
    !params.version ||
    !params.token ||
    !params.userAgent
  ) {
    throw new Error('input_missing');
  }

  let sessionParams = {};
  sessionParams.token = params.token;

  let session = await authsModel.getSession(sessionParams);

  if (!session.active || new Date(session.expiry) < new Date()) {
    throw new Error('authn_fail');
  }

  sessionParams = {};
  sessionParams.token = params.token;
  sessionParams.version = params.version;
  sessionParams.userAgent = params.userAgent;
  sessionParams.expiry = utilsService.addDays(
    new Date(),
    config.AUTH.SESSION_EXPIRY_EXTEND_DAYS,
  );

  await authsModel.updateSession(sessionParams);

  let deviceParams = {};
  deviceParams.identifier = params.identifier;
  deviceParams.version = params.version;
  deviceParams.userAgent = params.userAgent;

  await authsModel.updateDevice(deviceParams);

  let response = status.getStatus('success');
  response.data = {};
  response.data.user = {};
  response.data.user.id = session.user_id;
  response.data.user.role_id = session.role_id;
  response.data.user.email = session.email;
  response.data.user.session = {};
  response.data.user.session.token = session.token;
  response.data.user.session.expiry = session.expiry;

  return response;
};

const verifyGoogleAuthentication = async () => {
  return passport.authenticate('google', { session: false });
};

const socialLogin = async (params) => {
  if (
    !params.state ||
    !params.providerCode ||
    !params.profileId ||
    !params.firstName ||
    !params.lastName ||
    !params.email
  ) {
    throw new Error('input_missing');
  }

  let providerParams = {};
  providerParams.code = params.providerCode;

  let providers = await authsModel.getProviders(providerParams);
  if (!providers || providers.length === 0) {
    throw new Error('provider_missing');
  }

  let provider = providers[0];

  let authenticationRequestParams = {};
  authenticationRequestParams.state = params.state;

  let authenticationRequests = await authsModel.getAuthenticationRequests(
    authenticationRequestParams,
  );

  authenticationRequestParams.providerId = provider.id;
  authenticationRequestParams.verified = 0;

  authenticationRequests = authenticationRequests.filter(
    (authenticationRequest) =>
      new Date(authenticationRequest.expiry) > new Date(),
  );

  if (authenticationRequests && authenticationRequests.length === 0) {
    throw new Error('authn_fail');
  }

  let authenticationRequest = authenticationRequests[0];

  let userParams = {};
  userParams.email = params.email;

  let user = await usersModel.getUser(userParams);

  if (!user) {
    let userParams = {};
    userParams.email = params.email;
    userParams.roleId = params.roleId ? params.roleId : 1;
    await usersModel.createUser(userParams);

    userParams = {};
    userParams.email = params.email;
    user = await usersModel.getUser(userParams);

    userParams = {};
    userParams.userId = user.id;
    userParams.firstName = params.firstName;
    userParams.lastName = params.lastName;
    await usersModel.createUserMetaData(userParams);
  }

  let _role = {
    id: user.role_id,
    role: user.role,
  };
  delete user.role_id;
  delete user.role;
  user.role = _role;

  let deviceParams = {};
  deviceParams.identifier = params.identifier
    ? params.identifier
    : 'default.device';

  let device = await authsModel.getDevice(deviceParams);

  if (!device) {
    let deviceParams = {};
    deviceParams.identifier = params.identifier
      ? params.identifier
      : 'default.device';
    deviceParams.originId = params.originId ? params.originId : 1;
    deviceParams.platformId = params.platformId ? params.platformId : 1;
    deviceParams.appVersion = params.appVersion ? params.appVersion : 1;
    deviceParams.userAgent = params.userAgent
      ? params.userAgent
      : defaultUserAgent();

    await authsModel.createDevice(deviceParams);

    deviceParams = {};
    deviceParams.identifier = params.identifier
      ? params.identifier
      : 'default.device';
    deviceParams.originId = params.originId ? params.originId : 1;
    deviceParams.platformId = params.platformId ? params.platformId : 1;
    deviceParams.appVersion = params.appVersion ? params.appVersion : 1;

    device = await authsModel.getDevice(deviceParams);
  }

  let sessionParams = {};
  sessionParams.userId = user.id;
  sessionParams.deviceId = device.id;
  sessionParams.token = utilsService.generateRandom();
  sessionParams.expiry = utilsService.addDays(
    new Date(),
    config.AUTH.SESSION_EXPIRY_EXTEND_DAYS,
  );

  await authsModel.createSession(sessionParams);
  let session = await authsModel.getSession(sessionParams);

  authenticationRequestParams = {};
  authenticationRequestParams.reference = authenticationRequest.reference;
  authenticationRequestParams.providerId = provider.id;
  authenticationRequestParams.state = params.state;
  authenticationRequestParams.userId = user.id;
  authenticationRequestParams.email = user.email;
  authenticationRequestParams.verified = 1;

  await authsModel.updateAuthenticationRequest(authenticationRequestParams);

  let response = status.getStatus('success');
  response.data = {};
  response.data.user = user;
  response.data.session = session;

  return response;
};

const logout = async (params) => {
  if (!params.token) {
    throw new Error('input_missing');
  }

  let sessionParams = {};
  sessionParams.token = params.token;
  sessionParams.active = 0;

  await authsModel.updateSession(sessionParams);

  let response = status.getStatus('success');

  return response;
};

export default {
  getProviders: wrapperService.wrap(getProviders),
  validateSession: wrapperService.wrap(validateSession),
  createAuthenticationRequest: wrapperService.wrap(createAuthenticationRequest),
  verifyGoogleAuthentication: wrapperService.wrap(verifyGoogleAuthentication),
  socialLogin: wrapperService.wrap(socialLogin),
  logout: wrapperService.wrap(logout),
};
