import authsService from '../services/auth.js';
import wrapperService from '../services/wrapper.js';

const getProviders = async (req, res) => {
  let providerParams = {};
  let result = await authsService.getProviders(providerParams);

  return res.json(result);
};

const createAuthenticationRequest = async (req, res) => {
  if (!req.body.provider_id) {
    throw new Error('input_missing');
  }

  let authenticationRequestParams = {};
  authenticationRequestParams.providerId = parseInt(req.body.provider_id);
  req.body.email ? (authenticationRequestParams.email = req.body.email) : null;

  let result = await authsService.createAuthenticationRequest(
    authenticationRequestParams,
  );

  return res.json(result);
};

const createSocialAuthenticationRequest = async (req, res, next) => {
  if (!req.query.provider_id || !req.query.state) {
    throw new Error('input_missing');
  }

  let authenticationRequestParams = {};
  authenticationRequestParams.providerId = parseInt(req.query.provider_id);
  authenticationRequestParams.state = req.query.state;

  let middleware = await authsService.createAuthenticationRequest(
    authenticationRequestParams,
  );

  return middleware(req, res, next);
};

const verifyGoogleAuthentication = async (req, res, next) => {
  let authenticationParams = {};
  req.query.state ? (authenticationParams.state = req.query.state) : null;

  let middleware =
    await authsService.verifyGoogleAuthentication(authenticationParams);

  return middleware(req, res, next);
};

const postVerifyGoogleAuthentication = async (req, res) => {
  let authenticationParams = {};
  authenticationParams.state = req.query.state;
  authenticationParams.providerCode = 'google';
  authenticationParams.profileId = req.user.id;
  authenticationParams.email = req.user.emails[0].value;
  authenticationParams.firstName = req.user.name.givenName;
  authenticationParams.lastName = req.user.name.familyName;

  let result = await authsService.socialLogin(authenticationParams);

  return res.json(result);
};

const logout = async (req, res) => {
  let logoutParams = {};
  logoutParams.token = req.headers['x-auth'];

  let result = await authsService.logout(logoutParams);

  return res.json(result);
};

export default {
  getProviders: wrapperService.wrap(getProviders),
  createAuthenticationRequest: wrapperService.wrap(createAuthenticationRequest),
  createSocialAuthenticationRequest: wrapperService.wrap(
    createSocialAuthenticationRequest,
  ),
  verifyGoogleAuthentication: wrapperService.wrap(verifyGoogleAuthentication),
  postVerifyGoogleAuthentication: wrapperService.wrap(
    postVerifyGoogleAuthentication,
  ),
  logout: wrapperService.wrap(logout),
};
