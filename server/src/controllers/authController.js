import * as authService from "../services/authService.js";
import { validateLogin } from "../utils/validators.js";

export async function login(req, res, next) {
  try {
    const errors = validateLogin(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }

    const result = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({ success: true, data: { admin: req.admin } });
}

export async function logout(_req, res) {
  res.json({ success: true, data: { message: "Logged out" } });
}
