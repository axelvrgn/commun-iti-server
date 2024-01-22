import { Container } from "inversify";
import { RoomService } from "./services/RoomService";
import { RoomRepository } from "./repositories/RoomRepository";
import { SqlRoomRepository } from "./platform/sql/SqlRoomRepository";

export async function registerRoomModule(container: Container) {
  container.bind(RoomService).toSelf();
  container.bind(RoomRepository).to(SqlRoomRepository);

  const roomService = container.get(RoomService);
  await roomService.initialyze();
}
