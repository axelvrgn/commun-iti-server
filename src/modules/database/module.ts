import { DataSource } from "typeorm";
import { EntityManagerProvider } from "./provider/EntityManagerProvider";
import { DefaultEntityManagerProvider } from "./provider/DefaultEntityManagerProvider";
import { Container } from "inversify";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { createDatabase } from "typeorm-extension";

export async function registerDatabaseModule(
  container: Container,
  options: PostgresConnectionOptions
) {
  await createDatabase({
    options,
    ifNotExist: true,
  });

  const connection = new DataSource({
    ...options,
    synchronize: false,
    logging: false,
    entities: [`${__dirname}/entities/**/*{.ts,.js}`],
    migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
    subscribers: [`${__dirname}/subscribers/**/*{.ts,.js}`],
  });

  container.bind(DataSource).toConstantValue(connection);
  container
    .bind(EntityManagerProvider)
    .to(DefaultEntityManagerProvider)
    .inSingletonScope();

  await connection.initialize();
  await connection.runMigrations();
}
