import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("t_room_participant")
export class tRoomParticipant {
  @PrimaryColumn({ name: "room_id" })
  roomId!: string;

  @PrimaryColumn({ name: "user_id" })
  userId!: string;
}
