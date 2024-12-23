import express from 'express';
import controller from '../controllers/urls.js';

const router = express.Router();

router.post('/shorten', controller.shortenUrl);
router.get('/shorten/:alias', controller.urlRedirector);

export default router;
