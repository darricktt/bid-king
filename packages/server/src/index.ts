import { createServer } from 'node:http';
import express, { type Request, type Response } from 'express';
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { monitor } from '@colyseus/monitor';
import { SHARED_VERSION, type HealthCheckPayload } from '@bid-king/shared';

import { logger } from './utils/logger.ts';

const PORT = Number(process.env.PORT ?? 2567);

const app = express();

app.get('/health', (_req: Request, res: Response) => {
  const payload: HealthCheckPayload = {
    ok: true,
    ts: Date.now(),
    sharedVersion: SHARED_VERSION,
  };
  res.json(payload);
});

app.use('/colyseus', monitor());

const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

// P1 将在此处注册 BidKingRoom
// gameServer.define('bid_king', BidKingRoom);

gameServer
  .listen(PORT)
  .then(() => {
    logger.info(
      { port: PORT, sharedVersion: SHARED_VERSION, env: process.env.NODE_ENV ?? 'development' },
      'server started',
    );
  })
  .catch((err: unknown) => {
    logger.error({ err }, 'server failed to start');
    process.exit(1);
  });
