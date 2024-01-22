import * as uuid from "uuid";
import { injectable } from "inversify";
import { RoomRepository } from "../repositories/RoomRepository";
import { DomainEventEmitter } from "modules/core/DomainEventEmitter";
import { Room } from "../domain/Room";
import { Bad, Ok } from "modules/core/result";
import { assert } from "modules/core/utils";
import { UserRepository } from "modules/user/repositories/UserRepository";
import { RoomEvents } from "../events";

@injectable()
export class RoomService {
  constructor(
    private roomRepo: RoomRepository,
    private userRepo: UserRepository,
    private emitter: DomainEventEmitter
  ) {}

  async initialyze() {
    const firstRoom = await this.roomRepo.findFirst();
    if (!firstRoom) {
      const systemUser = {
        creationDate: new Date(),
        username: "system",
        id: uuid.v4(),
      };

      await this.userRepo.create(systemUser);
      await this.create("Général", systemUser.id);
    }
  }

  async create(name: string, userId: string) {
    const room: Room = {
      id: uuid.v4(),
      creationDate: new Date(),
      creatorId: userId,
      name,
    };

    const roomExists = await this.roomRepo.exists(name);
    if (roomExists) {
      return Bad("room_already_exists");
    }

    await this.roomRepo.create(room);
    await this.roomRepo.join(room.id, userId);

    this.emitter.emit(RoomEvents.RoomCreatedEvent, {
      roomId: room.id,
      creatorId: userId,
      name,
    } as RoomEvents.RoomCreatedEventPayload);

    return Ok(room);
  }

  async join(roomId: string, userId: string) {
    const isInRoom = await this.roomRepo.isUserInRoom(roomId, userId);
    if (isInRoom) {
      return Bad("user_already_joined_room");
    }

    await this.roomRepo.join(roomId, userId);
    const room = await this.roomRepo.findById(roomId);
    assert(room);

    this.emitter.emit(RoomEvents.RoomJoinedEvent, {
      roomId: room.id,
      name: room.name,
      userId,
    } as RoomEvents.RoomJoinedEventPayload);

    return Ok(room);
  }

  async leave(roomId: string, userId: string) {
    const isInRoom = await this.roomRepo.isUserInRoom(roomId, userId);
    if (!isInRoom) {
      return Bad("user_not_in_room");
    }

    await this.roomRepo.leave(roomId, userId);
    const room = await this.roomRepo.findById(roomId);
    assert(room);

    this.emitter.emit(RoomEvents.RoomLeftEvent, {
      roomId: room.id,
      name: room.name,
      userId,
    } as RoomEvents.RoomLeftEventPayload);

    return Ok();
  }
}
