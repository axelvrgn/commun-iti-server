import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("t_user")
export class tUser {
  @PrimaryColumn({ name: "id" })
  id!: string;

  @Column({ name: "username" })
  username!: string;

  @Column({ name: "creation_date" })
  creationDate!: Date;

  @Column({ name: "photo_location", })
  photoLocation!: string;
}
