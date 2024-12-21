import passport from 'passport';
import { Strategy as googleStrategy } from 'passport-google-oauth20';

import config from '../configs/config.js';

let google = new googleStrategy(
  {
    clientID: config.OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: config.OAUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: config.OAUTH.GOOGLE.CALLBACK_URL,
    scope: config.OAUTH.GOOGLE.SCOPE,
  },
  async (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  },
);

passport.use(google);

export default passport;

