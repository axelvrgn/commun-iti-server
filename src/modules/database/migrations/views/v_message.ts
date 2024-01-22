import { MigrationInterface, QueryRunner } from "typeorm";

export class v_room implements MigrationInterface {
  name = `v_message_${Date.now()}`;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP VIEW IF EXISTS v_message;
        CREATE VIEW v_message AS (
          SELECT _message.*, to_json(_user) as author, 
          coalesce((SELECT json_agg(_reactions.reactions) FROM (SELECT json_build_object('emoji', emoji, 'userReactions', json_agg(_reaction)) as reactions FROM t_message_reaction _reaction  WHERE message_id = _message.id group by _reaction.emoji ) as _reactions), '[]'::json ) as reactions
          
          FROM t_message _message
          INNER JOIN t_user _user ON _user.id = _message.author_id
        )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
