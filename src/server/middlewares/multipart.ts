import { formidable } from "formidable";
import { NextFunction, Request, Response } from "express";

export function multipart() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form = formidable({
        multiples: false,
        hashAlgorithm: "sha256",
        maxFileSize: 512 * 1024 * 1024,
      });
      const [fields, files] = await form.parse(req);
      req.body = fields;

      for (let prop in req.body) {
        if (req.body[prop].length < 2) {
            req.body[prop] = req.body[prop][0];
        }
      }

      for (let prop in files) {
        const file = files[prop]![0]!;
        // TODO
        req.body[prop] = {
          name: file.originalFilename,
          path: file.filepath,
          hash: file.hash,
          type: file.mimetype,
        };
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
