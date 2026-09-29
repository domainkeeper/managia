import * as registrationService from "../services/registrationService.js";
import { validateRegistration } from "../utils/validators.js";

export async function register(req, res, next) {
  try {
    const errors = validateRegistration(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }
    const registration = await registrationService.registerForEvent(req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: {
        registration,
        message: "Registration successful! We look forward to seeing you at the event.",
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const { search, eventId, year, college, sort, page, limit } = req.query;
    const result = await registrationService.getRegistrations({
      search, eventId, year, college, sort, page, limit,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const registration = await registrationService.getRegistrationById(req.params.id);
    res.json({ success: true, data: { registration } });
  } catch (err) {
    next(err);
  }
}
