import { Container } from "inversify";
import { DomainEventEmitter } from "modules/core/DomainEventEmitter";
import { SocketIoWebsocketService } from "./platform/socketio/SocketIoWebsocketService";
import { WebsocketService } from "./services/WebsocketService";
import { RoomEvents } from "modules/room/events";
import { UserRepository } from "modules/user/repositories/UserRepository";
import { MessageEvents } from "modules/message/events";
import { MessageRepository } from "modules/message/repository/MessageRepository";
import { assert } from "modules/core/utils";

export async function registerSocketModule(
  container: Container,
  config: {
    emitter: DomainEventEmitter;
    fileUrl: string;
  }
) {
  container
    .bind(WebsocketService)
    .to(SocketIoWebsocketService)
    .inSingletonScope();

  const emitter = config.emitter;
  const socket = container.get(WebsocketService);

  emitter.on(
    RoomEvents.RoomCreatedEvent,
    async (payload: RoomEvents.RoomCreatedEventPayload) => {
      const userRepo = container.get(UserRepository);
      const creator = await userRepo.findById(payload.creatorId);

      if (creator) {
        socket.publish(`room_created`, {
          id: payload.roomId,
          name: payload.name,
          creator: {
            ...creator,
            pictureUrl: creator.photoLocation
              ? `${config.fileUrl}/${creator.photoLocation}`
              : undefined,
          },
        });
      } else {
        console.error("User not found");
      }
    }
  );

  emitter.on(
    RoomEvents.RoomJoinedEvent,
    async (payload: RoomEvents.RoomJoinedEventPayload) => {
      const userRepo = container.get(UserRepository);
      const user = await userRepo.findById(payload.userId);

      if (user) {
        socket.publish(`room_joined`, {
          id: payload.roomId,
          name: payload.name,
          user: {
            ...user,
            pictureUrl: user.photoLocation
              ? `${config.fileUrl}/${user.photoLocation}`
              : undefined,
          },
        });
      } else {
        console.error("User not found");
      }
    }
  );

  emitter.on(
    RoomEvents.RoomLeftEvent,
    async (payload: RoomEvents.RoomLeftEventPayload) => {
      const userRepo = container.get(UserRepository);
      const user = await userRepo.findById(payload.userId);

      if (user) {
        socket.publish(`room_left`, {
          id: payload.roomId,
          name: payload.name,
          user: {
            ...user,
            pictureUrl: user.photoLocation
              ? `${config.fileUrl}/${user.photoLocation}`
              : undefined,
          },
        });
      } else {
        console.error("User not found");
      }
    }
  );

  emitter.on(
    MessageEvents.MessageReactionEvent,
    async (payload: MessageEvents.MessageReactionEventPayload) => {
      const userRepo = container.get(UserRepository);
      const messageRepo = container.get(MessageRepository);
      const message = await messageRepo.findById(payload.messageId);
      const user = await userRepo.findById(payload.userId);

      if (user && message) {
        const author = await userRepo.findById(message.author.id);
        assert(author);

        socket.publish(`message_reaction`, {
          message: {
            ...message,
            author: {
              ...author,
              pictureUrl: author.photoLocation
                ? `${config.fileUrl}/${author.photoLocation}`
                : undefined,
            },
          },
          emoji: payload.emoji,
          user: {
            ...user,
            pictureUrl: user.photoLocation
              ? `${config.fileUrl}/${user.photoLocation}`
              : undefined,
          },
        });
      } else {
        console.error("User or message not found");
      }
    }
  );

  emitter.on(
    MessageEvents.MessageReactionRemovedEvent,
    async (payload: MessageEvents.MessageReactionRemovedEventPayload) => {
      const userRepo = container.get(UserRepository);
      const messageRepo = container.get(MessageRepository);
      const user = await userRepo.findById(payload.userId);
      const message = await messageRepo.findById(payload?.messageId);

      if (user && message) {
        socket.publish(`message_reaction_removed`, {
          messageId: payload.messageId,
          roomId: message.roomId,
          emoji: payload.emoji,
          user: {
            ...user,
            pictureUrl: user.photoLocation
              ? `${config.fileUrl}/${user.photoLocation}`
              : undefined,
          },
        });
      } else {
        console.error("User or message not found");
      }
    }
  );

  emitter.on(
    MessageEvents.NewMessageEvent,
    async (payload: MessageEvents.NewMessageEventPayload) => {
      socket.publish(`room_${payload.message.roomId}_new_message`, {
        ...payload.message,
        reactions: [],
        author: {
          ...payload.author,
          pictureUrl: payload.author.photoLocation
            ? `${config.fileUrl}/${payload.author.photoLocation}`
            : undefined,
        },
      });
    }
  );
}
