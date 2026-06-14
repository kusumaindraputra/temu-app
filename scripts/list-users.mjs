import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const p = await db.pengelola.findMany({ select: { username: true, role: true } });
const b = await db.bidang.findMany({ select: { username: true }, take: 5 });
console.log("Pengelola:", JSON.stringify(p));
console.log("Bidang:", JSON.stringify(b));
await db.$disconnect();
