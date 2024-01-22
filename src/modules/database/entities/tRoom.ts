import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("t_room")
export class tRoom {
  @PrimaryColumn({ name: "id" })
  id!: string;

  @Column({ name: "name" })
  name!: string;

  @Column({ name: "creation_date" })
  creationDate!: Date;

  @Column({ name: "creator_id" })
  creatorId!: string;
}
