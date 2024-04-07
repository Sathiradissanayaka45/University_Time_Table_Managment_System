const Resource = require('../../models/Resource');
const ResourceController = require('../../controllers/ResourceController');
const mongoose = require('mongoose');

jest.mock('../../models/Resource');

describe('TimetableController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
describe('ResourceController - createResource', () => {
  it('should create a resource successfully', async () => {
    const req = { body: { name: 'Test Resource', description: 'Test Description' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await ResourceController.createResource(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource created successfully', resource: expect.any(Object) });
  });

  it('should return an error if resource with the same name already exists', async () => {
    const req = { body: { name: 'Existing Resource', description: 'Existing Description' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Resource, 'findOne').mockResolvedValue({ name: 'Existing Resource', description: 'Existing Description' });

    await ResourceController.createResource(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'This Resource is already exist in the system' });
  });
});

describe('ResourceController - getAllResources', () => {
  it('should get all resources successfully', async () => {
    const req = {};
    const res = { json: jest.fn() };

    const resources = [{ name: 'Resource 1', description: 'Description 1' }, { name: 'Resource 2', description: 'Description 2' }];
    jest.spyOn(Resource, 'find').mockResolvedValue(resources);

    await ResourceController.getAllResources(req, res);

    expect(res.json).toHaveBeenCalledWith(resources);
  });

  it('should handle internal server error', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Resource, 'find').mockRejectedValue(new Error('Test Error'));

    await ResourceController.getAllResources(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

 describe('ResourceController - updateResourceAvailability', () => {

  it('should update resource availability by ID', async () => {
    const req = { params: { resourceId: 'resourceId' }, body: { isAvailable: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const updatedResource = { _id: 'resourceId', name: 'Test Resource', description: 'Test Description', isAvailable: true };
    jest.spyOn(Resource, 'findByIdAndUpdate').mockResolvedValue(updatedResource);
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);

    await ResourceController.updateResourceAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource availability updated successfully', resource: updatedResource });
  });

  it('should return 404 if resource is not found', async () => {
    const req = { params: { resourceId: 'resourceId' }, body: { isAvailable: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Resource, 'findByIdAndUpdate').mockResolvedValue(null);

    await ResourceController.updateResourceAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
  });
  it('should handle internal server error', async () => {
    const req = { params: { resourceId: 'resourceId' }, body: { isAvailable: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Resource, 'findByIdAndUpdate').mockRejectedValue(new Error('Test Error'));

    await ResourceController.updateResourceAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
describe('deleteResourceById', () => {
  it('should delete resource by ID', async () => {
    const req = { params: { resourceId: 'resourceId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const deletedResource = { _id: 'resourceId', name: 'Test Resource', description: 'Test Description', isAvailable: true };
    jest.spyOn(Resource, 'findByIdAndDelete').mockResolvedValue(deletedResource);
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);

    await ResourceController.deleteResourceById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource deleted successfully', resource: deletedResource });
  });
  it('should return 404 if resource ID is invalid', async () => {
    const req = { params: { resourceId: 'invalidId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);

    await ResourceController.deleteResourceById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
});

  it('should handle internal server error', async () => {
    const req = { params: { resourceId: 'resourceId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Resource, 'findByIdAndDelete').mockRejectedValue(new Error('Test Error'));
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);

    await ResourceController.deleteResourceById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

});
