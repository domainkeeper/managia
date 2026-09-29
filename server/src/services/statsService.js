import prisma from "../utils/prisma.js";

export async function getDashboardStats() {
  const now = new Date();

  const [totalEvents, upcomingEvents, totalRegistrations, featuredEvents, recentEvents] =
    await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { date: { gt: now } } }),
      prisma.registration.count(),
      prisma.event.count({ where: { isFeatured: true } }),
      prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          _count: { select: { registrations: true } },
        },
      }),
    ]);

  return {
    totalEvents,
    upcomingEvents,
    totalRegistrations,
    featuredEvents,
    recentEvents: recentEvents.map((e) => ({
      id: e.id,
      name: e.name,
      date: e.date,
      time: e.time,
      category: e.category,
      registrationCount: e._count.registrations,
    })),
  };
}
