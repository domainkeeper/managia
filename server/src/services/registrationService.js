import prisma from "../utils/prisma.js";
import { badRequestError, conflictError, notFoundError } from "../utils/errors.js";
import { getEventStatus, isRegistrationOpen } from "../utils/eventStatus.js";

export async function registerForEvent(eventId, data) {
  const event = await prisma.event.findUnique({ where: { id: Number(eventId) } });
  if (!event) throw notFoundError("Event");

  if (!isRegistrationOpen(event)) {
    throw badRequestError("Registration is closed for this event");
  }

  const regCount = await prisma.registration.count({
    where: { eventId: Number(eventId) },
  });
  if (regCount >= event.capacity) {
    throw badRequestError("This event has reached its maximum capacity");
  }

  const now = new Date();
  if (now > new Date(event.registrationDeadline)) {
    throw badRequestError("Registration deadline has passed");
  }

  const existing = await prisma.registration.findUnique({
    where: { eventId_email: { eventId: Number(eventId), email: data.email.trim().toLowerCase() } },
  });
  if (existing) {
    throw conflictError("You have already registered for this event with this email");
  }

  const registration = await prisma.registration.create({
    data: {
      eventId: Number(eventId),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      college: data.college.trim(),
      year: data.year.trim(),
      phone: data.phone.trim(),
    },
    include: { event: { select: { id: true, name: true, date: true, time: true, venue: true } } },
  });

  return registration;
}

export async function getRegistrations({ search, eventId, year, college, sort, page = 1, limit = 20 } = {}) {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { college: { contains: search, mode: "insensitive" } },
    ];
  }

  if (eventId) {
    where.eventId = Number(eventId);
  }

  if (year && year !== "all") {
    where.year = year;
  }

  if (college && college !== "all") {
    where.college = college;
  }

  let orderBy;
  switch (sort) {
    case "name":
      orderBy = { name: "asc" };
      break;
    case "event":
      orderBy = { event: { name: "asc" } };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [registrations, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
      include: {
        event: { select: { id: true, name: true, category: true, date: true, time: true } },
      },
    }),
    prisma.registration.count({ where }),
  ]);

  return {
    registrations,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

export async function getRegistrationById(id) {
  const registration = await prisma.registration.findUnique({
    where: { id: Number(id) },
    include: {
      event: { select: { id: true, name: true, category: true, date: true, time: true, venue: true } },
    },
  });
  if (!registration) throw notFoundError("Registration");
  return registration;
}

export async function getRegistrationStats() {
  const total = await prisma.registration.count();
  return { total };
}
