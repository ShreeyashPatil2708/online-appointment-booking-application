const express = require('express');
const router = express.Router();
const spController = require('../controllers/serviceProviderController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { serviceProviderUpdateSchema, timeSlotSchema } = require('../utils/validators');
const { ROLES } = require('../config/constants');

// Public routes
router.get('/', spController.getAllProviders);
router.get('/:id', spController.getProviderById);
router.get('/:id/slots', spController.getProviderSlots);
router.get('/:id/reviews', spController.getProviderReviews);

// Provider-only routes
router.get('/me/profile', authenticate, authorize(ROLES.SERVICE_PROVIDER), spController.getMyProfile);
router.put('/me/profile', authenticate, authorize(ROLES.SERVICE_PROVIDER), validate(serviceProviderUpdateSchema), spController.updateMyProfile);
router.get('/me/appointments', authenticate, authorize(ROLES.SERVICE_PROVIDER), spController.getProviderAppointments);
router.get('/me/stats', authenticate, authorize(ROLES.SERVICE_PROVIDER), spController.getProviderStats);
router.post('/me/slots', authenticate, authorize(ROLES.SERVICE_PROVIDER), validate(timeSlotSchema), spController.addTimeSlot);
router.patch('/me/slots/:slotId/block', authenticate, authorize(ROLES.SERVICE_PROVIDER), spController.blockTimeSlot);
router.patch('/me/slots/:slotId/unblock', authenticate, authorize(ROLES.SERVICE_PROVIDER), spController.unblockTimeSlot);
router.delete('/me/slots/:slotId', authenticate, authorize(ROLES.SERVICE_PROVIDER), spController.deleteTimeSlot);

module.exports = router;
