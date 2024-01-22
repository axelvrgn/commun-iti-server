import { injectable } from "inversify";
import {
  PaginatedResult,
  PaginationOptions,
} from "modules/core/domain/Pagination";
import { tRoom } from "modules/database/entities/tRoom";
import { tRoomParticipant } from "modules/database/entities/tRoomParticipant";
import { vRoomParticipant } from "modules/database/entities/vRoomParticipant";
import { EntityManagerProvider } from "modules/database/provider/EntityManagerProvider";
import { Room } from "modules/room/domain/Room";
import { RoomData } from "modules/room/models/RoomData";
import { RoomRepository } from "modules/room/repositories/RoomRepository";
import { ILike, Not } from "typeorm";

@injectable()
export class SqlRoomRepository extends RoomRepository {
  constructor(private readonly emProvider: EntityManagerProvider) {
    super();
  }

  async create(room: Room): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.insert(tRoom, room);
  }

  async findById(id: string): Promise<Room | null> {
    const manager = this.emProvider.getEntityManager();
    const roomEntity = await manager.findOneBy(tRoom, { id });

    return roomEntity;
  }

  async exists(name: string): Promise<boolean> {
    const manager = this.emProvider.getEntityManager();
    const room = await manager.findOne(tRoom, {
      where: {
        name: ILike(name),
      },
    });

    return !!room;
  }

  async findFirst(): Promise<Room | null> {
    const manager = this.emProvider.getEntityManager();
    const firtRoom = await manager.findOne(tRoom, {
      where: {},
      order: {
        creationDate: "ASC",
      },
    });

    return firtRoom;
  }

  async getPaginatedUserRooms(
    userId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<RoomData>> {
    const manager = this.emProvider.getEntityManager();
    const [data, total] = await manager.findAndCount(vRoomParticipant, {
      take: options.perPage,
      skip: options.page * options.perPage,
      where: {
        userId,
      },
    });

    return {
      ...options,
      data,
      total,
    };
  }

  async join(roomId: string, userId: string): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.insert(tRoomParticipant, {
      roomId,
      userId,
    });
  }

  async leave(roomId: string, userId: string): Promise<void> {
    const manager = this.emProvider.getEntityManager();
    await manager.delete(tRoomParticipant, {
      roomId,
      userId,
    });
  }

  async searchAvailable(userId: string, name: string): Promise<Room[]> {
    const manager = this.emProvider.getEntityManager();
    const rooms = await manager.find(tRoom, {
      where: {
        name: ILike(`%${name}%`),
      },
    });

    return rooms;
  }

  async isUserInRoom(roomId: string, userId: string): Promise<boolean> {
    const manager = this.emProvider.getEntityManager();
    const participation = await manager.findOneBy(tRoomParticipant, {
      roomId,
      userId,
    });

    return !!participation;
  }
}
