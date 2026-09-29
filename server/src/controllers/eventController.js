import * as eventService from "../services/eventService.js";
import { validateEvent } from "../utils/validators.js";

export async function getAll(req, res, next) {
  try {
    const { search, category, sort } = req.query;
    const events = await eventService.getAllEvents({ search, category, sort });
    res.json({ success: true, data: { events } });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({ success: true, data: { event } });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validateEvent(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }
    const event = await eventService.createEvent(req.body);
    res.status(201).json({ success: true, data: { event } });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const errors = validateEvent(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.json({ success: true, data: { event } });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await eventService.deleteEvent(req.params.id);
    res.json({ success: true, data: { message: "Event deleted" } });
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(_req, res, next) {
  try {
    const event = await eventService.getFeaturedEvent();
    res.json({ success: true, data: { event } });
  } catch (err) {
    next(err);
  }
}

export async function getCategories(_req, res, next) {
  try {
    const categories = await eventService.getCategories();
    res.json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
}
