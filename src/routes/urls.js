import express from 'express';
import controller from '../controllers/urls.js';

const router = express.Router();

router.post('/shorten', controller.getProviders);


export default router;