// controllers/eventController.js

import Events from '../models/Event.js';

// GET all events
export const getAllEvents = async (req, res) => {
  try {
    const filters = {};

    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.ticketPrice) {
      filters.ticketPrice = req.query.ticketPrice;
    }

    const events = await Events.find(filters);
    res.json(events);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// GET single event
export const getEventById = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// CREATE event (Admin)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      ticketPrice,
      imageUrl
    } = req.body;

    const event = await Events.create({
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      availableSeats: totalSeats,
      ticketPrice,
      imageUrl,
      createdBy: req.user._id
    });

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// UPDATE event
export const updateEvent = async (req, res) => {
  try {
    const event = await Events.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// DELETE event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Events.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found'
      });
    }

    res.json({
      message: 'Event deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};