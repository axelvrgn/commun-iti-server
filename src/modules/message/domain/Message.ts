import { RichText } from "./RichText";

export interface Message {
  id: string;
  roomId: string;
  authorId: string;
  creationDate: Date;
  text: RichText;
}
