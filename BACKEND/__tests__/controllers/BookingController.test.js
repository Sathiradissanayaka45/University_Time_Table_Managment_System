const BookingController = require('../../controllers/BookingController');
const Booking = require('../../models/Booking');
const Room = require('../../models/Room');
const Resource = require('../../models/Resource');

jest.mock('../../models/Booking');
jest.mock('../../models/Room');
jest.mock('../../models/Resource');

describe('BookingController - book', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a booking successfully', async () => {
    const req = { 
      body: { 
        roomId: 'validRoomId',
        resourceId: 'validResourceId',
        startTime: new Date('2024-03-25T08:00:00Z'),
        endTime: new Date('2024-03-25T09:00:00Z'),
        discription: 'Test booking' 
      } 
    };
    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    };

    Room.exists.mockResolvedValueOnce(true);
    Resource.exists.mockResolvedValueOnce(true);
    Booking.findOne.mockResolvedValueOnce(null);
    Booking.prototype.save.mockResolvedValueOnce({});

    await BookingController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Booking created successfully' }));
  });
  it('should return 400 if room ID does not exist', async () => {
    const req = { body: { roomId: 'invalidRoomId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Room.exists.mockResolvedValueOnce(false);

    await BookingController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Room ID does not exist' });
  });
  it('should return 400 if resource ID does not exist', async () => {
    const req = { body: { resourceId: 'invalidResourceId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Room.exists.mockResolvedValueOnce(true);
    Resource.exists.mockResolvedValueOnce(false);

    await BookingController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource ID does not exist' });
  });
  it('should return 400 if start time is after end time', async () => {
    const req = { body: { startTime: new Date('2024-03-25T09:00:00Z'), endTime: new Date('2024-03-25T08:00:00Z') } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Room.exists.mockResolvedValueOnce(true);
    Resource.exists.mockResolvedValueOnce(true);

    await BookingController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Start time must be before end time' });
  });
  it('should return 400 if there is a room booking conflict', async () => {
    const req = { 
      body: { 
        roomId: 'validRoomId',
        startTime: new Date('2024-03-25T08:00:00Z'),
        endTime: new Date('2024-03-25T09:00:00Z') 
      } 
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Room.exists.mockResolvedValueOnce(true);
    Booking.findOne.mockResolvedValueOnce({});

    await BookingController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Booking conflicts with existing room booking' });
  });
  it('should return 400 if there is a resource booking conflict', async () => {
    const req = { 
      body: { 
        resourceId: 'validResourceId',
        startTime: new Date('2024-03-25T08:00:00Z'),
        endTime: new Date('2024-03-25T09:00:00Z') 
      } 
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Resource.exists.mockResolvedValueOnce(true);
    Booking.findOne.mockResolvedValueOnce({});

    await BookingController.book(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Booking conflicts with existing resource booking' });
  });
});

describe('BookingController - getAllBookings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all bookings successfully', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Booking.find.mockResolvedValueOnce([]);

    await BookingController.getAllBookings({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ bookings: [] }));
  });
});

describe('BookingController - getBookingById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a booking by ID successfully', async () => {
    const req = { params: { id: 'validBookingId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Booking.findById.mockResolvedValueOnce({});

    await BookingController.getBookingById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('BookingController - deleteBookingById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a booking by ID successfully', async () => {
    const req = { params: { id: 'validBookingId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Booking.findByIdAndDelete.mockResolvedValueOnce({});

    await BookingController.deleteBookingById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Booking deleted successfully' }));
  });
});
