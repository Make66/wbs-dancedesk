import 'dotenv/config';   // must be first
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
import "#db";
import { errorHandler } from "#middlewares";
import {
  authRouter,
  chatRouter,
  eventsRouter,
  categoriesRouter,
  coursesRouter,
  customersRouter,
  instructorsRouter,
  locationsRouter,
  modulesRouter,
  newsRouter,
  participantsRouter,
  publicRouter,
  registrationsRouter,
  roomsRouter,
  settingsRouter,
  targetsRouter,
  textsRouter,
  usersRouter,
} from "#routes";

const app = express();
const port = Number(process.env.PORT) || 8000;

const allowedOrigins = (process.env.CORS_ORIGINS ?? process.env.CLIENT_BASE_URL ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (e.g. curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    exposedHeaders: ["WWW-Authenticate"],
  }),
);

app.use(express.json(), cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/public", publicRouter);
app.use("/api/chats", chatRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/customers", customersRouter);
app.use("/api/events", eventsRouter);
app.use("/api/instructors", instructorsRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/modules", modulesRouter);
app.use("/api/news", newsRouter);
app.use("/api/participants", participantsRouter);
app.use("/api/registrations", registrationsRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/targets", targetsRouter);
app.use("/api/texts", textsRouter);
app.use("/api/users", usersRouter);

app.use("/assets", express.static(join(__dirname, "..", "assets")));

app.use("/*splat", (_req, res) => {
  res.status(404).json({ error: "Not found (splat)" });
});

app.use(errorHandler);

const host = process.env.HOST ?? (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost');
app.listen(port, host, () => console.log(`Server listening on http://${host}:${port}`));
