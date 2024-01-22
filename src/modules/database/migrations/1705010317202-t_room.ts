import { MigrationInterface, QueryRunner } from "typeorm";

export class t_room_1705010317202 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS t_room(
      id UUID NOT NULL PRIMARY KEY,
      name VARCHAR NOT NULL,
      creation_date TIMESTAMP NOT NULL,
      creator_id UUID REFERENCES t_user(id)
  );

  CREATE UNIQUE INDEX t_room_name ON t_room(name);
  `);

    await queryRunner.query(`
  CREATE TABLE IF NOT EXISTS t_room_participant(
    room_id UUID NOT NULL REFERENCES t_room(id),
    user_id UUID NOT NULL REFERENCES t_user(id),
    PRIMARY KEY(room_id, user_id)
);
`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
