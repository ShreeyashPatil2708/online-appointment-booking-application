const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { userUpdateSchema, reviewSchema } = require('../utils/validators');

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(userUpdateSchema), userController.updateProfile);
router.get('/notifications', userController.getNotifications);
router.patch('/notifications/:id/read', userController.markNotificationRead);
router.post('/reviews', validate(reviewSchema), userController.addReview);
router.get('/reviews', userController.getMyReviews);

module.exports = router;
