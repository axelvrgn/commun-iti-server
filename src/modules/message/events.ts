import { User } from "modules/user/domain";
import { Message } from "./domain/Message";

export namespace MessageEvents {
  export const MessageReactionEvent = "message_reaction";
  export interface MessageReactionEventPayload {
    messageId: string;
    userId: string;
    emoji: string;
  }

  export const MessageReactionRemovedEvent = "message_reaction_removed";
  export interface MessageReactionRemovedEventPayload {
    messageId: string;
    userId: string;
    emoji: string;
  }

  export const NewMessageEvent = "new_message";
  export interface NewMessageEventPayload {
    message: Message;
    author: User;
  }
}
