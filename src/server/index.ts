import "reflect-metadata";
import "./controllers";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { SERVER_CONFIG } from "./config/env";
import { InversifyExpressServer } from "inversify-express-utils";
import { rootContainer } from "./config/container";
import { configureExpress } from "./config/app";
import { NextFunction, Request, Response } from "express";
import { registerDatabaseModule } from "modules/database/module";
import { registerUserModule } from "modules/user/module";
import { registerRoomModule } from "modules/room/module";
import { registerMessageModule } from "modules/message/module";
import { registerSocketModule } from "modules/socket/module";
import { emitter } from "./config/emitter";
import { WebsocketService } from "modules/socket/services/WebsocketService";
import { verify } from "jsonwebtoken";
import { UserInfo } from "modules/user/domain";

async function setup() {
  await registerDatabaseModule(rootContainer, {
    type: "postgres",
    database: SERVER_CONFIG.DB_NAME,
    url: SERVER_CONFIG.DB_URL,
  });

  await registerUserModule(
    rootContainer,
    3600 * 24 * 365,
    SERVER_CONFIG.AUTH_SECRET
  );

  await registerRoomModule(rootContainer);

  await registerMessageModule(rootContainer);

  await registerSocketModule(rootContainer, {
    emitter: emitter,
    fileUrl: SERVER_CONFIG.FILES_BASE_URL,
  });
}

function start() {
  const app = new InversifyExpressServer(rootContainer)
    .setConfig((app) => configureExpress(app, rootContainer))
    .setErrorConfig((app) => {
      app.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).send("");
      });

      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(`${err.message} - ${err.stack}`);
        res.status(500).send();
      });
    })
    .build();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", function (socket: Socket) {
    const socketService = rootContainer.get(WebsocketService);
    const token = socket.handshake.auth["accessToken"];

    try {
      const user = verify(token, SERVER_CONFIG.AUTH_SECRET) as UserInfo;

      console.log(`-- new socket connection ${socket.id} for ${user.id} `);
      socketService.connect(socket, user.id);

      socket.on("subscribe", (msg) => {
        socketService.subscribeTo(socket, user.id, msg.topic);
      });

      socket.on("unsubscribe", (msg) => {
        socketService.unsubscribeTo(socket, user.id, msg.topic);
      });

      socket.on("disconnect", (reason) => {
        console.log(`-- ${socket.id} disconnected: ${reason}`);
        socketService.disconnect(socket, user.id);
      });
    } catch (e) {
      console.error(e);
    }
  });

  server.listen(SERVER_CONFIG.PORT, () => {
    console.info(`-- Server successfully started`);
    console.info(`-- Listening on ${SERVER_CONFIG.PORT}`);
  });
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise rejection", error as Error);
});

setup()
  .then(() => start())
  .catch((e) => console.error(e));
