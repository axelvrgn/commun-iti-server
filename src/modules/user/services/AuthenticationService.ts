import * as bCrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { sign } from "jsonwebtoken";
import { AuthenticationResponse } from "../domain/Authentication";
import { Bad, Ok, OkVal } from "modules/core/result";
import { AuthenticationRepository } from "../repositories/AuthenticationRepository";

export type ChallengeAuthenticationResult =
  | OkVal<AuthenticationResponse>
  | Bad<"invalid_credentials">;

export class AuthenticationService {
  constructor(
    private tokenLifetime: number,
    private authSecret: string,
    private userRepo: UserRepository,
    private authRepo: AuthenticationRepository
  ) {}

  async challenge(
    username: string,
    password: string
  ): Promise<ChallengeAuthenticationResult> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      return Bad("invalid_credentials");
    }

    const credentials = await this.authRepo.findByUserId(user.id);
    if (!credentials) {
      return Bad("invalid_credentials");
    }

    const passwordMatches = await bCrypt.compare(
      password,
      credentials.passwordHash
    );
    if (!passwordMatches) {
      return Bad("invalid_credentials");
    }

    const userInfo = {
      id: user.id,
      username: user.username,
    };

    const token = sign(userInfo, this.authSecret, {
      expiresIn: this.tokenLifetime,
    });

    return Ok({
      user: user,
      bearer: {
        token,
        expiresAt: Date.now() + this.tokenLifetime * 1000,
      },
    });
  }
}
