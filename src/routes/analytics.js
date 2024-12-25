import express from 'express';
import controller from '../controllers/analytics.js';

const router = express.Router();

router.get('/:alias', controller.analytics);
router.get('/topic/:topic', controller.topicAnalytics);

export default router;
