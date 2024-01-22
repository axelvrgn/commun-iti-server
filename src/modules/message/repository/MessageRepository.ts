import { injectable } from "inversify";
import { Message } from "../domain/Message";
import {
  PaginatedResult,
  PaginationOptions,
} from "modules/core/domain/Pagination";
import { MessageData } from "../models/MessageData";

@injectable()
export abstract class MessageRepository {
  abstract create(message: Message): Promise<void>;
  abstract setReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void>;

  abstract findById(messageId: string): Promise<MessageData | null>;

  abstract removeReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void>;

  abstract getPaginatedMessages(
    roomId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<MessageData>>;
}
