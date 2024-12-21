import config from '../configs/config.js';

import utilsService from '../services/utils.js';
import wrapperService from '../services/wrapper.js';

const getUser = async (params) => {
  if (!params.userId && !params.email) {
    throw new Error('input_missing');
  }

  let getUserQuery = config.knex
    .select('u.id')
    .select('r.id as role_id')
    .select('r.role')
    .select('u.email')
    .select('um.first_name')
    .from('users as u')
    .join('roles as r', { 'r.id': 'u.role_id' })
    .leftJoin('user_metadata as um', { 'um.user_id': 'u.id' });

  params.userId ? getUserQuery.where('u.id', params.userId) : null;
  params.email ? getUserQuery.where('u.email', params.email) : null;

  let result = await getUserQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

const createUser = async (params) => {
  if (!params.roleId || !params.email) {
    throw new Error('input_missing');
  }

  let _insert = { role_id: params.roleId, email: params.email };

  let createUserQuery = config.knex.insert(_insert).into('users');

  let result = (await createUserQuery)[0];

  return result;
};

const createUserMetaData = async (params) => {
  if (!params.userId || !params.firstName || !params.lastName) {
    throw new Error('input_missing');
  }
  
  let _insert = {
    user_id: params.userId,
    first_name: params.firstName,
    last_name: params.lastName,
  };

  let createUserMetaDataQuery = config.knex
    .insert(_insert)
    .into('user_metadata');

  let result = await createUserMetaDataQuery;

  return result;
};

export default {
  getUser: wrapperService.wrap(getUser),
  createUser: wrapperService.wrap(createUser),
  createUserMetaData: wrapperService.wrap(createUserMetaData),
};
