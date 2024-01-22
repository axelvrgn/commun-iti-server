import { Router, Request, Response } from "express";
import { FileStorage } from "modules/user/services/FileStorage";
import { z } from "zod";
import { validateParams } from "./zodValidationMiddleware";
import { lookup } from "mime-types";

export const fileQuerySchema = z.object({
  name: z.string(),
  type: z.string(),
});

export const FileRouter = function (fileStorageFn: () => FileStorage) {
  return Router().get(
    "/:type/:name",
    validateParams(fileQuerySchema),
    (req: Request, res: Response) => {
      try {
        const fileStorage = fileStorageFn();
        const stream = fileStorage.read(
          `${req.params.type}/${req.params.name}`
        );
        res.setHeader("content-type", lookup(req.params.name!) as string);
        stream.on("error", (e) => {
          res.status(404);
          res.send("");
        });
        stream.pipe(res);
      } catch (e) {
        res.status(500);
        res.send("");
      }
    }
  );
};
