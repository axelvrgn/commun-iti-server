import { EntityManagerProvider } from "./EntityManagerProvider";
import { Connection, DataSource, EntityManager } from "typeorm";
import { injectable } from "inversify";

@injectable()
export class DefaultEntityManagerProvider extends EntityManagerProvider {
    constructor(
        private readonly _connection: DataSource 
    ) { super(); }

    getEntityManager(): EntityManager {
        return this._connection.manager;
    }
}
