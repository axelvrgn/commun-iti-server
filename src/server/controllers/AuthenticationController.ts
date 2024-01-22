import { Request } from "express";
import {
  BaseHttpController,
  controller,
  httpPost,
  interfaces,
} from "inversify-express-utils";
import { loginRequestSchema } from "./models/authentication";
import { validateBody } from "server/middlewares/zodValidationMiddleware";
import { AuthenticationService, UserService } from "modules/user/services";
import { SERVER_CONFIG } from "server/config/env";

@controller("/auth")
export class AuthenticationController extends BaseHttpController {
  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) {
    super();
  }

  @httpPost("/login", validateBody(loginRequestSchema))
  async login(req: Request) {
    const username = this.userService.normalizeUsername(req.body.username);
    const result = await this.authService.challenge(
      username,
      req.body.password
    );

    if (!result.success) {
      return this.badRequest(result.reason);
    }

    return this.ok({
      ...result.value,
      user: {
        ...result.value.user,
        pictureUrl: result.value.user.photoLocation
          ? `${SERVER_CONFIG.FILES_BASE_URL}/${result.value.user.photoLocation}`
          : undefined,
      },
    });
  }
}
