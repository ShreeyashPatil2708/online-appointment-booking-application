const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { appointmentSchema } = require('../utils/validators');
const { ROLES } = require('../config/constants');

router.use(authenticate);

router.post('/', validate(appointmentSchema), appointmentController.createAppointment);
router.get('/my', appointmentController.getMyAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.patch('/:id/cancel', appointmentController.cancelAppointment);
router.patch('/:id/reschedule', appointmentController.rescheduleAppointment);
router.patch('/:id/confirm', authorize(ROLES.SERVICE_PROVIDER), appointmentController.confirmAppointment);
router.patch('/:id/reject', authorize(ROLES.SERVICE_PROVIDER), appointmentController.rejectAppointment);
router.patch('/:id/complete', authorize(ROLES.SERVICE_PROVIDER), appointmentController.completeAppointment);

module.exports = router;
