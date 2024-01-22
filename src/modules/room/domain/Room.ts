import { User } from "modules/user/domain";

export interface Room {
  id: string;
  name: string;
  creationDate: Date;
  creatorId: string;
}
