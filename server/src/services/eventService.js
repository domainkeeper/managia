import prisma from "../utils/prisma.js";
import { notFoundError, badRequestError, conflictError } from "../utils/errors.js";
import { getEventStatus, isRegistrationOpen } from "../utils/eventStatus.js";

export async function getAllEvents({ search, category, sort } = {}) {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "all") {
    where.category = category;
  }

  let orderBy;
  switch (sort) {
    case "date-asc":
      orderBy = { date: "asc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "upcoming":
    default:
      orderBy = { date: "asc" };
      break;
  }

  const events = await prisma.event.findMany({
    where,
    orderBy,
    include: {
      _count: { select: { registrations: true } },
    },
  });

  return events.map((event) => ({
    ...event,
    registrationCount: event._count.registrations,
    status: getEventStatus(event),
    registrationOpen: isRegistrationOpen(event),
    _count: undefined,
  }));
}

export async function getEventById(id) {
  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: {
      _count: { select: { registrations: true } },
    },
  });
  if (!event) throw notFoundError("Event");

  return {
    ...event,
    registrationCount: event._count.registrations,
    status: getEventStatus(event),
    registrationOpen: isRegistrationOpen(event),
    _count: undefined,
  };
}

export async function createEvent(data) {
  return prisma.event.create({
    data: {
      name: data.name.trim(),
      category: data.category.trim(),
      description: data.description.trim(),
      date: new Date(data.date),
      time: data.time.trim(),
      venue: data.venue.trim(),
      imageUrl: data.imageUrl?.trim() || null,
      registrationDeadline: new Date(data.registrationDeadline),
      capacity: Number(data.capacity) || 100,
      isFeatured: Boolean(data.isFeatured),
    },
  });
}

export async function updateEvent(id, data) {
  const event = await prisma.event.findUnique({ where: { id: Number(id) } });
  if (!event) throw notFoundError("Event");

  return prisma.event.update({
    where: { id: Number(id) },
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.category && { category: data.category.trim() }),
      ...(data.description && { description: data.description.trim() }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.time && { time: data.time.trim() }),
      ...(data.venue && { venue: data.venue.trim() }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl?.trim() || null }),
      ...(data.registrationDeadline && { registrationDeadline: new Date(data.registrationDeadline) }),
      ...(data.capacity !== undefined && { capacity: Number(data.capacity) }),
      ...(data.isFeatured !== undefined && { isFeatured: Boolean(data.isFeatured) }),
    },
  });
}

export async function deleteEvent(id) {
  const event = await prisma.event.findUnique({ where: { id: Number(id) } });
  if (!event) throw notFoundError("Event");

  await prisma.event.delete({ where: { id: Number(id) } });
  return event;
}

export async function getFeaturedEvent() {
  const event = await prisma.event.findFirst({
    where: { isFeatured: true },
    orderBy: { date: "asc" },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  if (!event) return null;

  return {
    ...event,
    registrationCount: event._count.registrations,
    status: getEventStatus(event),
    registrationOpen: isRegistrationOpen(event),
    _count: undefined,
  };
}

export async function getCategories() {
  const result = await prisma.event.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return result.map((r) => r.category);
}
