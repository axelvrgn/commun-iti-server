import {
  BaseHttpController,
  controller,
  httpGet,
} from "inversify-express-utils";
import { OpenGraphReader } from "modules/core/OpenGraphReader";
import { Request } from "express";

@controller("/open-graph")
export class OpenGraphController extends BaseHttpController {
  constructor(private readonly ogs: OpenGraphReader) {
    super();
  }

  @httpGet("/parse")
  async parse(req: Request) {
    const result = await this.ogs.read(req.query.url as string);
    return result;
  }
}
