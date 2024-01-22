import { injectable } from "inversify";
import { Room } from "../domain/Room";
import { RoomData } from "../models/RoomData";
import {
  PaginatedResult,
  PaginationOptions,
} from "modules/core/domain/Pagination";

@injectable()
export abstract class RoomRepository {
  abstract create(room: Room): Promise<void>;
  abstract findById(roomId: string): Promise<Room | null>;
  abstract exists(roomId: string): Promise<boolean>;
  abstract findFirst(): Promise<Room | null>;
  abstract isUserInRoom(roomId: string, userId: string): Promise<boolean>;
  abstract join(roomId: string, userId: string): Promise<void>;
  abstract leave(roomId: string, userId: string): Promise<void>;
  abstract searchAvailable(userId: string, name: string): Promise<Room[]>;
  abstract getPaginatedUserRooms(
    userId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<RoomData>>;
}
