import { User } from "modules/user/domain";
import { ViewColumn, ViewEntity } from "typeorm";
import { tRoom } from "./tRoom";
import { toCamelCase } from "../utils/toCamelCase";

@ViewEntity("v_room_participant")
export class vRoomParticipant extends tRoom {
  @ViewColumn({ name: "creator", transformer: toCamelCase })
  creator!: User;

  @ViewColumn({ name: "user_id" })
  userId!: string;
}
