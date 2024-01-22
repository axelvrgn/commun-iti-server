import { User } from "modules/user/domain";
import { RichText } from "../domain/RichText";

export interface MessageData {
  id: string;
  roomId: string;
  author: User;
  creationDate: Date;
  text: RichText;
  reactions: {
    emoji: string;

    reactions: {
      messageId: string;
      userId: string;
    }[];
  }[];
}
