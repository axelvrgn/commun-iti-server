import { MigrationInterface, QueryRunner } from "typeorm";

export class v_room implements MigrationInterface {
  name = `v_room_participant_${Date.now()}`;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP VIEW IF EXISTS v_room_participant;
        CREATE VIEW v_room_participant AS (
          SELECT _room.*, _participant.user_id, to_json(_user) as creator FROM t_room _room
          INNER JOIN t_user _user ON _user.id = _room.creator_id
          INNER JOIN t_room_participant _participant ON _participant.room_id = _room.id
        )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
