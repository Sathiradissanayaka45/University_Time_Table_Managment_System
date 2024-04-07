const Resource = require('../models/Resource');
const mongoose = require('mongoose');

const ResourceController = {

  createResource: async (req, res) => {
    try {
      const { name, discription } = req.body;
      // Check if a resource with the provided name already exists
      const existingResource = await Resource.findOne({ name });
        if (existingResource) {
          return res.status(400).json({ error: 'This Resource is already exist in the system' });
        }

      const newResource = new Resource({ name, discription });
      await newResource.save();
      res.status(201).json({ message: 'Resource created successfully', resource: newResource });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllResources: async (req, res) => {
    try {
      const resources = await Resource.find();
      res.json(resources);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateResourceAvailability: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const { isAvailable } = req.body;

      let updatedResource;

      // Check if resourceId is a valid MongoDB ObjectId
      if (mongoose.isValidObjectId(resourceId)) {
        updatedResource = await Resource.findByIdAndUpdate(resourceId, { isAvailable }, { new: true });
      } else {
        // Assume resourceId is the resource's name and update based on that
        updatedResource = await Resource.findOneAndUpdate({ name: resourceId }, { isAvailable }, { new: true });
      }

      if (!updatedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      res.status(200).json({ message: 'Resource availability updated successfully', resource: updatedResource });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteResourceById: async (req, res) => {
    try {
        const { resourceId } = req.params;

        // Check if resourceId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(resourceId)) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        // Find the resource by ID and delete it
        const deletedResource = await Resource.findByIdAndDelete(resourceId);

        if (!deletedResource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.status(200).json({ message: 'Resource deleted successfully', resource: deletedResource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},

};

module.exports = ResourceController;