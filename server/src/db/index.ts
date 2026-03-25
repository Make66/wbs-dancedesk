// import mongoose from 'mongoose';

// try {
//   const mongoURI = process.env.MONGO_URI;
//   if (!mongoURI) throw new Error('No Mongo DB Connection String present');
//   const client = await mongoose.connect(mongoURI, { dbName: 'travel-journal' });
//   console.log(`Connected to MongoDB @ ${client.connection.host} - ${client.connection.name}`);
// } catch (error) {
//   console.log(error);
//   process.exit(1);
// }
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.ts";
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });