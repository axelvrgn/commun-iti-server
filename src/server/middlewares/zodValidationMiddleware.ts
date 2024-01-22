import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export function validate(
  getData: (req: Request) => any,
  schema: AnyZodObject
): (req: Request, resp: Response, next: NextFunction) => void {
  return (req: Request, resp: Response, next: NextFunction) => {
    const result = schema.safeParse(getData(req));

    if (result.success) {
      next();
    } else {
      resp.status(400).send({
        reason: "validation_failed",
        data: result.error.issues.map((issue) => ({
          code: issue.code,
          path: issue.path.join("."),
        })),
      });
    }
  };
}

export function validateBody(schema: AnyZodObject) {
  return validate((req) => req.body, schema);
}

export function validateQuery(schema: AnyZodObject) {
  return validate((req) => req.query, schema);
}

export function validateParams(schema: AnyZodObject) {
    return validate((req) => req.params, schema);
  }
