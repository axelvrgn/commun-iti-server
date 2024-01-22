import { ViewColumn, ViewEntity } from "typeorm";
import { tMessage } from "./tMessage";
import { User } from "modules/user/domain";
import { tMessageReaction } from "./tMessageReaction";
import { toCamelCase } from "../utils/toCamelCase";

@ViewEntity("v_message")
export class vMessage extends tMessage {
  @ViewColumn({ name: "author", transformer: toCamelCase })
  author!: User;

  @ViewColumn({ name: "reactions", transformer: toCamelCase })
  reactions!: {
    emoji: string;
    reactions: tMessageReaction[];
  }[];
}
