import { injectable } from "inversify";
import { tUser } from "modules/database/entities/tUser";
import { EntityManagerProvider } from "modules/database/provider/EntityManagerProvider";
import { User } from "modules/user/domain";
import { UserRepository } from "modules/user/repositories/UserRepository";
import { ILike } from "typeorm";

@injectable()
export class SqlUserRepository extends UserRepository {
  constructor(private readonly emProvider: EntityManagerProvider) {
    super();
  }

  async create(user: User): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.insert(tUser, user);
  }

  async update(user: {
    id: string;
    username?: string | undefined;
    photoLocation?: string | undefined;
  }): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.update(tUser, { id: user.id }, user);
  }

  async findById(id: string): Promise<User | null> {
    const manager = this.emProvider.getEntityManager();
    const userEntity = await manager.findOneBy(tUser, { id });

    return userEntity;
  }

  async findByUsername(username: string): Promise<User | null> {
    const manager = this.emProvider.getEntityManager();
    const userEntity = await manager.findOneBy(tUser, { username: ILike(username) });

    return userEntity;
  }

  search(token: string): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}
