import { getDashboardStats } from "../services/statsService.js";

export async function dashboard(_req, res, next) {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: { stats } });
  } catch (err) {
    next(err);
  }
}
