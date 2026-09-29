import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.admin.deleteMany();

  // Create admin
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.create({
    data: {
      name: "Admin User",
      email: "admin@collegeclub.com",
      passwordHash,
    },
  });
  console.log("✓ Admin created:", admin.email);

  // Create events
  const now = new Date();
  const events = await Promise.all([
    prisma.event.create({
      data: {
        name: "Tech Summit 2026",
        category: "Technical",
        description:
          "Join us for an immersive full-day technology summit featuring hands-on workshops on AI/ML, web3, and cloud-native development. Network with industry experts and showcase your skills.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 15)),
        time: "09:00",
        venue: "Main Auditorium, Building A",
        imageUrl: "/images/tech-summit.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 25)),
        capacity: 200,
        isFeatured: true,
      },
    }),
    prisma.event.create({
      data: {
        name: "Cultural Night 2026",
        category: "Cultural",
        description:
          "Celebrate diversity with an evening of music, dance, drama, and art. Featuring performances from student clubs across all disciplines.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 20)),
        time: "18:00",
        venue: "Open Air Theatre",
        imageUrl: "/images/cultural-night.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 28)),
        capacity: 300,
        isFeatured: false,
      },
    }),
    prisma.event.create({
      data: {
        name: "React Workshop",
        category: "Workshop",
        description:
          "A comprehensive hands-on workshop covering React hooks, context API, performance optimization, and building production-ready applications.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 10)),
        time: "14:00",
        venue: "Computer Lab 3, CS Building",
        imageUrl: "/images/react-workshop.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 8)),
        capacity: 40,
        isFeatured: false,
      },
    }),
    prisma.event.create({
      data: {
        name: "Annual Sports Meet",
        category: "Sports",
        description:
          "The biggest sporting event of the year! Compete in cricket, football, basketball, badminton, and athletics. Trophies and medals for winners.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 5)),
        time: "07:00",
        venue: "College Sports Complex",
        imageUrl: "/images/sports-meet.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 25)),
        capacity: 500,
        isFeatured: true,
      },
    }),
    prisma.event.create({
      data: {
        name: "AI & ML Seminar",
        category: "Seminar",
        description:
          "Guest lecture by Dr. Priya Sharma on the latest advances in artificial intelligence and machine learning. Topics include transformer architectures and responsible AI.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 8)),
        time: "11:00",
        venue: "Seminar Hall 2",
        imageUrl: "/images/ai-seminar.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 5)),
        capacity: 150,
        isFeatured: false,
      },
    }),
    prisma.event.create({
      data: {
        name: "HackFusion 2026",
        category: "Competition",
        description:
          "A 36-hour hackathon challenging teams to solve real-world problems using technology. Prizes worth ₹50,000. Industry mentors will guide participants.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 22)),
        time: "10:00",
        venue: "Innovation Hub, Building C",
        imageUrl: "/images/hackathon.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 18)),
        capacity: 120,
        isFeatured: true,
      },
    }),
    prisma.event.create({
      data: {
        name: "Photography Contest",
        category: "Competition",
        description:
          "Capture the essence of campus life through your lens. Categories include Landscape, Portrait, Street Photography, and Mobile Photography.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 28)),
        time: "15:00",
        venue: "Art Gallery, Block D",
        imageUrl: "/images/photo-contest.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 25)),
        capacity: 80,
        isFeatured: false,
      },
    }),
    prisma.event.create({
      data: {
        name: "Leadership Workshop",
        category: "Workshop",
        description:
          "Develop essential leadership and soft skills. Topics include team management, public speaking, conflict resolution, and project planning.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 12)),
        time: "10:00",
        venue: "Conference Room 1, Admin Block",
        imageUrl: "/images/leadership.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 5)),
        capacity: 60,
        isFeatured: false,
      },
    }),
    prisma.event.create({
      data: {
        name: "Farewell Party 2026",
        category: "Cultural",
        description:
          "A grand farewell evening for our graduating seniors. Music, food, memories, and heartfelt goodbyes.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 20)),
        time: "17:00",
        venue: "Banquet Hall, Student Center",
        imageUrl: "/images/farewell.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 10)),
        capacity: 250,
        isFeatured: false,
      },
    }),
    prisma.event.create({
      data: {
        name: "CodeClash",
        category: "Technical",
        description:
          "Competitive programming contest featuring algorithmic challenges, data structure problems, and real-time leaderboards. Open to all skill levels.",
        date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 20)),
        time: "16:00",
        venue: "Online (Zoom) + Lab 5",
        imageUrl: "/images/codeclash.jpg",
        registrationDeadline: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 30)),
        capacity: 200,
        isFeatured: false,
      },
    }),
  ]);

  console.log("✓", events.length, "events created");

  // Create sample registrations
  const registrations = await Promise.all([
    prisma.registration.create({
      data: {
        eventId: events[0].id,
        name: "Aarav Patel",
        email: "aarav@college.edu",
        college: "College of Engineering",
        year: "3rd",
        phone: "9876543210",
      },
    }),
    prisma.registration.create({
      data: {
        eventId: events[0].id,
        name: "Sneha Reddy",
        email: "sneha@college.edu",
        college: "College of Technology",
        year: "2nd",
        phone: "9876543211",
      },
    }),
    prisma.registration.create({
      data: {
        eventId: events[0].id,
        name: "Vikram Singh",
        email: "vikram@college.edu",
        college: "College of Engineering",
        year: "4th",
        phone: "9876543212",
      },
    }),
    prisma.registration.create({
      data: {
        eventId: events[1].id,
        name: "Ananya Sharma",
        email: "ananya@college.edu",
        college: "College of Arts",
        year: "3rd",
        phone: "9876543213",
      },
    }),
    prisma.registration.create({
      data: {
        eventId: events[2].id,
        name: "Rohan Gupta",
        email: "rohan@college.edu",
        college: "College of Computer Science",
        year: "2nd",
        phone: "9876543214",
      },
    }),
    prisma.registration.create({
      data: {
        eventId: events[3].id,
        name: "Priya Verma",
        email: "priya@college.edu",
        college: "College of Engineering",
        year: "1st",
        phone: "9876543215",
      },
    }),
    prisma.registration.create({
      data: {
        eventId: events[5].id,
        name: "Karthik Nair",
        email: "karthik@college.edu",
        college: "College of Technology",
        year: "3rd",
        phone: "9876543216",
      },
    }),
    prisma.registration.create({
      data: {
        eventId: events[5].id,
        name: "Meera Iyer",
        email: "meera@college.edu",
        college: "College of Engineering",
        year: "4th",
        phone: "9876543217",
      },
    }),
  ]);

  console.log("✓", registrations.length, "registrations created");
  console.log("\nDevelopment admin credentials:");
  console.log("  Email:    admin@collegeclub.com");
  console.log("  Password: admin123");
  console.log("\n⚠ Change these credentials before production!\n");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
