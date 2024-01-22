import * as express from "express";
import * as passport from "passport";
import helmet, { crossOriginResourcePolicy } from "helmet";
import { BearerStrategy } from "server/middlewares/bearer";
import { SERVER_CONFIG } from "./env";
import { FileRouter } from "server/middlewares/fileRouter";
import { Container } from "inversify";
import { FileStorage } from "modules/user/services/FileStorage";

const xss = require("xss-clean");
const cors = require("cors");

export function configureExpress(
  app: express.Application,
  container: Container
) {
  passport.use(new BearerStrategy(SERVER_CONFIG.AUTH_SECRET));

  app.use(cors());

  // set security HTTP headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  // sanitize request data
  app.use(xss());

  app.use(
    "/file",
    FileRouter(() => container.get(FileStorage))
  );

  return app;
}
