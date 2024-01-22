import { Container } from "inversify";
import { MessageRepository } from "./repository/MessageRepository";
import { sqlMessageRepository } from "./platform/SqlMessageRepository";
import { MessageService } from "./services/MessageService";

export function registerMessageModule(container: Container) {
  container.bind(MessageRepository).to(sqlMessageRepository);
  container.bind(MessageService).toSelf();
}
