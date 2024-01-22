import { MigrationInterface, QueryRunner } from "typeorm";

export class t_authentication_credentials_1705010317201
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS t_authentication_credentials(
      user_id UUID NOT NULL PRIMARY KEY REFERENCES t_user(id),
      password_hash VARCHAR NOT NULL
  );
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
