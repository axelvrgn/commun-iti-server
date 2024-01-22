import { MigrationInterface, QueryRunner } from "typeorm";

export class t_user_1705010317200 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS t_user(
            id UUID NOT NULL PRIMARY KEY,
            username VARCHAR NOT NULL,
            creation_date TIMESTAMP,
            photo_location VARCHAR
        );

        CREATE UNIQUE INDEX t_user_username ON t_user(username);
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
