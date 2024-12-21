import express from 'express';
import controller from '../controllers/auths.js';

const router = express.Router();

router.get('/providers', controller.getProviders);
router.get('/requests/social', controller.createSocialAuthenticationRequest);
router.get(
  '/verify/google',
  controller.verifyGoogleAuthentication,
  controller.postVerifyGoogleAuthentication,
);
router.put('/logout', controller.logout);
router.get('/verifies', controller.getProviders);

export default router;
