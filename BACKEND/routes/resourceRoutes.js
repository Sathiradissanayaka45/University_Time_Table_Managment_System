const express = require('express');
const ResourceController = require('../controllers/ResourceController');
const { isFacultyOrAdmin } = require('../middlewares/Authorization/authForFacultyAndAdminMiddleware');
const { isAdmin } = require('../middlewares/Authorization/authForAdminMiddleware');

const router = express.Router();

// Create a resource
router.post('/', isAdmin, ResourceController.createResource);

// Get all resources
router.get('/', isFacultyOrAdmin, ResourceController.getAllResources);

// Update a resource's availability
router.put('/:resourceId', isFacultyOrAdmin, ResourceController.updateResourceAvailability);

// Delete a resource by ID
router.delete('/:resourceId', isAdmin, ResourceController.deleteResourceById);

module.exports = router;