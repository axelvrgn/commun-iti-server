import * as path from "path";
import { Container } from "inversify";
import { AuthenticationService, UserService } from "./services";
import { UserRepository } from "./repositories/UserRepository";
import { SqlUserRepository } from "./platform/sql/SqlUserRepository";
import { AuthenticationRepository } from "./repositories/AuthenticationRepository";
import { SqlAuthenticationRepository } from "./platform/sql/SqlAuthenticationRepository";
import { PictureService } from "./services/PictureService";
import { NodeSharpPictureService } from "./platform/sharp/NodeSharpPictureService";
import { FileStorage } from "./services/FileStorage";
import { LocalFileStorage } from "./platform/local/LocalFileStorage";

export function registerUserModule(
  container: Container,
  tokenLifetime: number,
  authSecret: string
) {
  container.bind(UserService).toSelf();
  container.bind(UserRepository).to(SqlUserRepository);
  container.bind(AuthenticationRepository).to(SqlAuthenticationRepository);
  container.bind(PictureService).to(NodeSharpPictureService);
  container.bind(FileStorage).toConstantValue(new LocalFileStorage(path.resolve(__dirname, "../../../files")));

  container
    .bind(AuthenticationService)
    .toConstantValue(
      new AuthenticationService(
        tokenLifetime,
        authSecret,
        container.get(UserRepository),
        container.get(AuthenticationRepository),
      )
    );
}
