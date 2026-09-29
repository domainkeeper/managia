import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { env } from "../config/env.js";
import { badRequestError, unauthorizedError } from "../utils/errors.js";

export async function login(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    throw unauthorizedError("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    throw unauthorizedError("Invalid email or password");
  }

  const token = jwt.sign({ adminId: admin.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email },
  };
}

export async function getMe(adminId) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, name: true, email: true },
  });
  if (!admin) throw unauthorizedError("Admin not found");
  return admin;
}
