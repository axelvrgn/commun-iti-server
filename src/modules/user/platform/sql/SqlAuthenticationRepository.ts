import { injectable } from "inversify";
import { tAuthenticationCredentials } from "modules/database/entities/tAuthenticationCredentials";
import { EntityManagerProvider } from "modules/database/provider/EntityManagerProvider";
import { AuthenticationCredentials } from "modules/user/domain/Authentication";
import { AuthenticationRepository } from "modules/user/repositories/AuthenticationRepository";

@injectable()
export class SqlAuthenticationRepository extends AuthenticationRepository {
  constructor(private readonly emProvider: EntityManagerProvider) {
    super();
  }

  async setCredentials(credentials: AuthenticationCredentials): Promise<void> {
    const manager = this.emProvider.getEntityManager();

    await manager.upsert(tAuthenticationCredentials, credentials, {
      conflictPaths: ["userId"],
    });
  }

  findByUserId(userId: string): Promise<AuthenticationCredentials | null> {
    const manager = this.emProvider.getEntityManager();

    return manager.findOneBy(tAuthenticationCredentials, { userId });
  }
}
