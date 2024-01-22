import { injectable } from "inversify";
import { EntityManager } from "typeorm";

@injectable()
export abstract class EntityManagerProvider {
    abstract getEntityManager(): EntityManager;
}
