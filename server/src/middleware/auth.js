import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import prisma from "../utils/prisma.js";
import { unauthorizedError } from "../utils/errors.js";

export async function authenticateAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw unauthorizedError("No token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, name: true, email: true },
    });

    if (!admin) {
      throw unauthorizedError("Admin not found");
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(unauthorizedError("Invalid token"));
    }
    if (err.name === "TokenExpiredError") {
      return next(unauthorizedError("Token expired"));
    }
    next(err);
  }
}
