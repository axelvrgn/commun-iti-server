import { User } from "modules/user/domain";

export interface RoomData {
  id: string;
  creationDate: Date;
  creator: User;
  name: string;
}
