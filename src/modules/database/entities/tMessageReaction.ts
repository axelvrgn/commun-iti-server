import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("t_message_reaction")
export class tMessageReaction {
  @PrimaryColumn({ name: "message_id" })
  messageId!: string;

  @PrimaryColumn({ name: "user_id" })
  userId!: string;
  
  @PrimaryColumn({ name: "emoji" })
  emoji!: string;
  
  @Column({ name: "creation_date" })
  creationDate!: Date;
}
