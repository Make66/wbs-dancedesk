import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "#db";
import { errorHandler } from "#middlewares";
import {
  authRouter,
  targetsRouter,
  categoriesRouter,
  coursesRouter,
  customersRouter,
  instructorsRouter,
  locationsRouter,
  modulesRouter,
  registrationsRouter,
  roomsRouter,
  textsRouter,
} from "#routes";

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    exposedHeaders: ["WWW-Authenticate"],
  }),
);

app.use(express.json(), cookieParser());

app.use("/auth", authRouter);
app.use("/targets", targetsRouter);
app.use("/categories", categoriesRouter);
app.use("/courses", coursesRouter);
app.use("/customers", customersRouter);
app.use("/instructors", instructorsRouter);
app.use("/locations", locationsRouter);
app.use("/modules", modulesRouter);
app.use("/registrations", registrationsRouter);
app.use("/rooms", roomsRouter);
app.use("/texts", textsRouter);

app.use("/*splat", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
