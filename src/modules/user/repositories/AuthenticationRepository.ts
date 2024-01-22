import { injectable } from "inversify";
import { AuthenticationCredentials } from "../domain/Authentication";

@injectable()
export abstract class AuthenticationRepository {
  abstract setCredentials(
    credentials: AuthenticationCredentials
  ): Promise<void>;

  abstract findByUserId(
    userId: string
  ): Promise<AuthenticationCredentials | null>;
}
