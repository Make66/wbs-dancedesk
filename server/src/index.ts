import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "#db";
import { errorHandler } from "#middlewares";
import {
  authRouter,
  eventsRouter,
  categoriesRouter,
  coursesRouter,
  customersRouter,
  instructorsRouter,
  locationsRouter,
  modulesRouter,
  participantsRouter,
  registrationsRouter,
  roomsRouter,
  settingsRouter,
  targetsRouter,
  textsRouter,
  usersRouter,
} from "#routes";

const app = express();
const port = process.env.PORT || 8000;

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

app.use("/auth", authRouter);
app.use("/categories", categoriesRouter);
app.use("/courses", coursesRouter);
app.use("/customers", customersRouter);
app.use("/events", eventsRouter);
app.use("/instructors", instructorsRouter);
app.use("/locations", locationsRouter);
app.use("/modules", modulesRouter);
app.use("/participants", participantsRouter);
app.use("/registrations", registrationsRouter);
app.use("/rooms", roomsRouter);
app.use("/settings", settingsRouter);
app.use("/targets", targetsRouter);
app.use("/texts", textsRouter);
app.use("/users", usersRouter);

app.use("/*splat", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
