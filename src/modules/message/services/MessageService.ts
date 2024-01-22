import * as uuid from "uuid";
import { injectable } from "inversify";
import { Message } from "../domain/Message";
import { RichText } from "../domain/RichText";
import { MessageRepository } from "../repository/MessageRepository";
import { DomainEventEmitter } from "modules/core/DomainEventEmitter";
import { UserRepository } from "modules/user/repositories/UserRepository";
import { assert } from "modules/core/utils";
import { MessageEvents } from "../events";

@injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly userRepo: UserRepository,
    private readonly emitter: DomainEventEmitter
  ) {}

  async send(newMessage: NewMessage) {
    const message: Message = {
      id: uuid.v4(),
      creationDate: new Date(),
      ...newMessage,
    };

    await this.messageRepo.create(message);
    const author = await this.userRepo.findById(newMessage.authorId);
    assert(author);

    this.emitter.emit(MessageEvents.NewMessageEvent, {
      author,
      message,
    } as MessageEvents.NewMessageEventPayload);

    return {
      ...message,
      author,
    };
  }

  async reactTo(reaction: MessageReaction) {
    await this.messageRepo.setReaction(
      reaction.messageId,
      reaction.userId,
      reaction.emoji
    );

    this.emitter.emit(
      MessageEvents.MessageReactionEvent,
      reaction as MessageEvents.MessageReactionEventPayload
    );
  }

  async removeReaction(messageId: string, userId: string, emoji: string) {
    await this.messageRepo.removeReaction(messageId, userId, emoji);

    this.emitter.emit(MessageEvents.MessageReactionRemovedEvent, {
      messageId,
      userId,
      emoji,
    } as MessageEvents.MessageReactionRemovedEventPayload);
  }
}

export interface NewMessage {
  authorId: string;
  roomId: string;
  text: RichText;
}

export interface MessageReaction {
  userId: string;
  messageId: string;
  emoji: string;
}
