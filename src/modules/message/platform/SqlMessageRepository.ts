import { EntityManagerProvider } from "modules/database/provider/EntityManagerProvider";
import { Message } from "../domain/Message";
import { MessageRepository } from "../repository/MessageRepository";
import { tMessage } from "modules/database/entities/tMessage";
import { tMessageReaction } from "modules/database/entities/tMessageReaction";
import { injectable } from "inversify";
import {
  PaginationOptions,
  PaginatedResult,
} from "modules/core/domain/Pagination";
import { MessageData } from "../models/MessageData";
import { vMessage } from "modules/database/entities/vMessage";

@injectable()
export class sqlMessageRepository extends MessageRepository {
  constructor(private readonly emProvider: EntityManagerProvider) {
    super();
  }

  async create(message: Message): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.insert(tMessage, message);
  }

  async findById(messageId: string): Promise<MessageData | null> {
    const manager = this.emProvider.getEntityManager();
    const message = await manager.findOneBy(vMessage, {
      id: messageId,
    });

    if (!message) {
      return null;
    }

    return message;
  }

  async setReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.upsert(
      tMessageReaction,
      {
        messageId,
        userId,
        emoji,
        creationDate: new Date(),
      },
      ["messageId", "userId", "emoji"]
    );
  }

  async removeReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.delete(tMessageReaction, {
      messageId,
      userId,
      emoji,
    });
  }

  async getPaginatedMessages(
    roomId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<MessageData>> {
    const manager = this.emProvider.getEntityManager();
    const [data, total] = await manager.findAndCount(vMessage, {
      take: options.perPage,
      skip: options.page * options.perPage,
      where: {
        roomId,
      },
      order: {
        creationDate: "DESC",
        id: "DESC",
      },
    });

    return {
      ...options,
      data,
      total,
    };
  }
}
