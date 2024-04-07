const RoomController = require('../../controllers/RoomController');
const Room = require('../../models/Room');
const mongoose = require('mongoose');

describe('RoomController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createRoom', () => {
    it('should create a new room if it does not already exist', async () => {
      const req = { body: { name: 'Room 1', capacity: 20 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(Room, 'findOne').mockResolvedValue(null);
      jest.spyOn(Room.prototype, 'save').mockResolvedValue({ name: 'Room 1', capacity: 20 });

      await RoomController.createRoom(req, res);

      expect(Room.findOne).toHaveBeenCalledWith({ name: 'Room 1' });
      expect(Room.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Room created successfully', room: expect.objectContaining({ name: 'Room 1', capacity: 20 }) });
    });
  });
  
  it('should update room availability by name if ID is not a valid ObjectId', async () => {
    const req = { params: { roomId: 'roomId' }, body: { isAvailable: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const updatedRoom = { _id: 'roomId', name: 'Room 1', capacity: 20, isAvailable: true }; // Define a placeholder value
    jest.spyOn(Room, 'findOneAndUpdate').mockResolvedValue(updatedRoom);
    jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false); // Correct mocking

    await RoomController.updateRoomAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Room availability updated successfully', room: updatedRoom });
  });
  //Correct expectation for 404 status code
  it('should return 404 if room is not found', async () => {
    const req = { params: { roomId: 'roomId' }, body: { isAvailable: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Room, 'findOneAndUpdate').mockResolvedValue(null); // Simulate room not found

    await RoomController.updateRoomAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(404); // Corrected expectation
    expect(res.json).toHaveBeenCalledWith({ error: 'Room not found' });
  });

  it('should handle internal server error', async () => {
    const req = { params: { roomId: 'roomId' }, body: { isAvailable: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Room, 'findOneAndUpdate').mockRejectedValue(new Error('Database Error')); // Simulate internal server error

    await RoomController.updateRoomAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(500); // Corrected expectation
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  describe('getAllRooms', () => {
    it('should return all rooms', async () => {
      const rooms = [{ name: 'Room 1', capacity: 20 }, { name: 'Room 2', capacity: 30 }];
      const req = {};
      const res = { json: jest.fn() };

      jest.spyOn(Room, 'find').mockResolvedValue(rooms);

      await RoomController.getAllRooms(req, res);

      expect(Room.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(rooms);
    });
    it('should handle internal server error', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(Room, 'find').mockRejectedValue(new Error('Database Error'));

      await RoomController.getAllRooms(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('deleteRoomById', () => {
    it('should handle invalid room ID', async () => {
      const roomId = 'invalidId';
      const req = { params: { roomId } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await RoomController.deleteRoomById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid room ID' });
    });
  });
});

