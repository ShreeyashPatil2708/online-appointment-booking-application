const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/deactivate', adminController.deactivateUser);
router.patch('/users/:id/activate', adminController.activateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/providers', adminController.getAllProviders);
router.get('/appointments', adminController.getAllAppointments);

module.exports = router;
