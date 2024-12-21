import config from '../configs/config.js';

import wrapperService from '../services/wrapper.js';
import utilsService from '../services/utils.js';

const getProviders = async (params) => {
  let getProvidersQuery = config.knex
    .select('id')
    .select('provider')
    .select('code')
    .select('active')
    .from('providers')
    .where('active', 1);

  params.providerId ? getProvidersQuery.where('id', params.providerId) : null;

  let result = await getProvidersQuery;

  return utilsService.sanitizeSqlResult(result);
};

const getSession = async (params) => {
  if (!params.sessionId && !params.token) {
    throw new Error('input_missing');
  }

  let getSessionQuery = config.knex
    .select('s.id')
    .select('u.email')
    .select('r.id', 'role_id')
    .select('s.token')
    .select('s.user_id')
    .select('s.expiry')
    .select('s.active')
    .select('d.id as device_id')
    .select('d.identifier')
    .select('d.origin_id')
    .select('d.platform_id')
    .select('d.app_version')
    .select('d.user_agent')
    .from('sessions as s')
    .join('devices as d', { 'd.id': 's.device_id' })
    .join('users as u', { 'u.id': 's.user_id' })
    .join('roles as r', { 'r.id': 'u.role_id' });

  params.sessionId ? getSessionQuery.where('s.id', params.sessionId) : null;
  params.token ? getSessionQuery.where('s.token', params.token) : null;

  let result = await getSessionQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

const createAuthenticationRequest = async (params) => {
  if (
    !params.reference ||
    !params.providerId ||
    !params.expiry ||
    !params.state
  ) {
    throw new Error('input_missing');
  }

  let _insert = {
    reference: params.reference.toString(),
    provider_id: params.providerId,
    expiry: new Date(params.expiry),
    state: params.state.toString(),
  };

  params.email ? (_insert['email'] = params.email) : null;
  params.token ? (_insert['token'] = params.token) : null;

  let createAuthenticationRequestQuery = config.knex
    .insert(_insert)
    .into('authentication_requests');

  let result = await createAuthenticationRequestQuery;

  return result[0];
};

const updateSession = async (params) => {
  if (!params.sessionId && !params.token) {
    throw new Error('input_missing');
  }

  let _update = { updated_at: new Date() };
  params.expiry ? (_update['expiry'] = new Date(params.expiry)) : null;
  params['active'] ? (_update['active'] = params.active) : null;

  let updateSessionQuery = config.knex('sessions').update(_update);

  params.sessionId ? updateSessionQuery.where('id', params.sessionId) : null;
  params.token ? updateSessionQuery.where('token', params.token) : null;

  await updateSessionQuery;

  return true;
};

const getAuthenticationRequests = async (params) => {
  if (
    !params.authenticationRequestId &&
    !params.email &&
    !params.reference &&
    !params.state
  ) {
    throw new Error('input_missing');
  }

  let getAuthenticationRequestsQuery = config.knex
    .select('reference')
    .select('token')
    .select('expiry')
    .select('verified')
    .select('state')
    .from('authentication_requests')
    .orderBy('id', 'desc');

  params.authenticationRequestId
    ? getAuthenticationRequestsQuery.where('id', params.authenticationRequestId)
    : null;
  params.reference
    ? getAuthenticationRequestsQuery.where('reference', params.reference)
    : null;
  params.email
    ? getAuthenticationRequestsQuery.where('email', params.email)
    : null;
  params.state
    ? getAuthenticationRequestsQuery.where('state', params.state)
    : null;
  params['verified']
    ? getAuthenticationRequestsQuery.where('verified', params.verified)
    : null;

  let result = await getAuthenticationRequestsQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result);
};

const updateAuthenticationRequest = async (params) => {
  if (!params.authenticationRequestId && !params.reference) {
    throw new Error('input_missing');
  }

  let _update = { updated_at: new Date() };
  params['verified'] ? (_update['verified'] = params.verified) : null;
  params.userId ? (_update['user_id'] = params.userId) : null;
  params.email ? (_update['email'] = params.email) : null;

  let updateAuthenticationRequestQuery = config
    .knex('authentication_requests')
    .update(_update);

  params.authenticationRequestId
    ? updateAuthenticationRequestQuery.where(
        'id',
        params.authenticationRequestId,
      )
    : null;
  params.reference
    ? updateAuthenticationRequestQuery.where('reference', params.reference)
    : null;

  await updateAuthenticationRequestQuery;

  return true;
};

const createSession = async (params) => {
  if (!params.token || !params.expiry || !params.deviceId || !params.userId) {
    throw new Error('input_missing');
  }

  let _insert = {
    token: params.token,
    expiry: params.expiry,
    device_id: params.deviceId,
    user_id: params.userId,
  };

  let createSessionQuery = config.knex.insert(_insert).into('sessions');

  let result = (await createSessionQuery)[0];

  return result;
};

const getDevice = async (params) => {
  if (!params.deviceId && !params.identifier) {
    throw new Error('input_missing');
  }

  let getDeviceQuery = config.knex
    .select('d.id')
    .select('d.origin_id')
    .select('d.platform_id')
    .select('d.app_version')
    .select('d.user_agent')
    .from('devices as d');

  params.deviceId ? getDeviceQuery.where('d.id', params.deviceId) : null;
  params.identifier
    ? getDeviceQuery.where('d.identifier', params.identifier)
    : null;

  let result = await getDeviceQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

const createDevice = async (params) => {
  if (
    !params.identifier ||
    !params.originId ||
    !params.platformId ||
    !params.appVersion ||
    !params.userAgent
  ) {
    throw new Error('input_missing');
  }

  let _insert = {
    identifier: params.identifier,
    origin_id: params.originId,
    platform_id: params.platformId,
    app_version: params.appVersion,
    user_agent: params.userAgent,
  };

  let createDeviceQuery = config.knex.insert(_insert).into('devices');

  await createDeviceQuery;

  return true;
};

const updateDevice = async (params) => {
  if (!params.deviceId && !params.identifier) {
    throw new Error('input_missing');
  }

  let _update = { updated_at: new Date().toISOString() };
  params.version ? (_update['app_version'] = params.version) : null;
  params.userAgent ? (_update['user_agent'] = params.userAgent) : null;

  let updateDeviceQuery = config.knex('devices').update(_update);

  params.deviceId ? updateDeviceQuery.where('id', params.deviceId) : null;
  params.identifier
    ? updateDeviceQuery.where('identifier', params.identifier)
    : null;

  await updateDeviceQuery;

  return true;
};

export default {
  getProviders: wrapperService.wrap(getProviders),
  createAuthenticationRequest: wrapperService.wrap(createAuthenticationRequest),
  getAuthenticationRequests: wrapperService.wrap(getAuthenticationRequests),
  updateAuthenticationRequest: wrapperService.wrap(updateAuthenticationRequest),
  getSession: wrapperService.wrap(getSession),
  updateSession: wrapperService.wrap(updateSession),
  createSession: wrapperService.wrap(createSession),
  getDevice: wrapperService.wrap(getDevice),
  createDevice: wrapperService.wrap(createDevice),
  updateDevice: wrapperService.wrap(updateDevice),
};
