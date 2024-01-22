import { RichText } from "modules/message/domain/RichText";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("t_message")
export class tMessage {
  @PrimaryColumn({ name: "id" })
  id!: string;

  @Column({ name: "creation_date" })
  creationDate!: Date;

  @Column({ name: "author_id" })
  authorId!: string;

  @Column({ name: "room_id" })
  roomId!: string;

  @Column({ name: "text", type: "jsonb" })
  text!: RichText;
}
