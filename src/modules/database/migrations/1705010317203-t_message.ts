import { MigrationInterface, QueryRunner } from "typeorm";

export class t_message_1705010317203 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS t_message(
      id UUID NOT NULL PRIMARY KEY,
      room_id UUID NOT NULL REFERENCES t_room(id),
      creation_date TIMESTAMP NOT NULL,
      author_id UUID NOT NULL REFERENCES t_user(id),
      text JSONB NOT NULL
  );
  `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
