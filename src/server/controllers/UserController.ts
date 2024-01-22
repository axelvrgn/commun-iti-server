import { Request } from "express";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  BaseHttpController,
} from "inversify-express-utils";

import {
  registerUserRequestSchema,
  updateUserRequestSchema,
  userExistsRequestSchema,
} from "./models/user";
import { UserService } from "modules/user/services";
import { UserRepository } from "modules/user/repositories/UserRepository";
import {
  validateBody,
  validateQuery,
} from "server/middlewares/zodValidationMiddleware";
import { multipart } from "server/middlewares/multipart";
import { authorize, readUserId } from "server/middlewares/bearer";
import { SERVER_CONFIG } from "server/config/env";

@controller("/user")
export class UserController extends BaseHttpController {
  constructor(
    private userService: UserService,
    private userRepo: UserRepository
  ) {
    super();
  }

  @httpPost("/", validateBody(registerUserRequestSchema))
  async register(req: Request) {
    const result = await this.userService.register(
      req.body.username,
      req.body.password,
      req.body.passwordConfirmation,
    );

    if (!result.success) {
      return this.badRequest(result.reason);
    }

    return this.ok(result.value);
  }

  @httpPut("/", authorize(), multipart(), validateBody(updateUserRequestSchema))
  async update(req: Request) {
    await this.userService.update(readUserId(req), req.body);
    return this.getUserInfo(req);
  }

  @httpGet("/exists", validateQuery(userExistsRequestSchema))
  async userExists(req: Request): Promise<boolean> {
    const query = req.query as any;
    const user = await this.userRepo.findByUsername(
      this.userService.normalizeUsername(query.username)
    );
    return !!user;
  }

  @httpGet("/", authorize())
  async getUserInfo(req: Request) {
    const userId = readUserId(req);
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new Error("Could not found user");
    }

    return {
      id: user.id,
      username: user.username,
      pictureUrl: user.photoLocation
        ? `${SERVER_CONFIG.FILES_BASE_URL}/${user.photoLocation}`
        : undefined,
    };
  }
}
