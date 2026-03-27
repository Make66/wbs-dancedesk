import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import '#db';
import { errorHandler } from '#middlewares';
import { authRouter, targetsRouter } from '#routes';

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    exposedHeaders: ['WWW-Authenticate']
  })
);

app.use(express.json(), cookieParser());

app.use('/auth', authRouter);
app.use('/targets', targetsRouter);

app.use('/*splat', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
