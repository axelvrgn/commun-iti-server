import { MigrationInterface, QueryRunner } from "typeorm";

export class t_message_reaction1705010317204 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS t_message_reaction(
      message_id UUID NOT NULL REFERENCES t_message(id),
      user_id UUID NOT NULL REFERENCES t_user(id),
      creation_date TIMESTAMP NOT NULL,
      emoji VARCHAR NOT NULL,
      PRIMARY KEY(message_id, user_id, emoji)
  );
  `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
