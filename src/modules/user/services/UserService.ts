import * as bCrypt from "bcrypt";
import * as fs from "fs";
import * as uuid from "uuid";
import * as path from "path";
import { injectable } from "inversify";
import { UserRepository } from "../repositories/UserRepository";
import { FileStorage } from "./FileStorage";
import { PictureService } from "./PictureService";
import { User } from "../domain";
import { DomainEventEmitter } from "modules/core/DomainEventEmitter";
import { Bad, Ok, OkVal } from "modules/core/result";
import { UploadedFile } from "modules/core/domain/UploadedFile";
import { assert } from "modules/core/utils";
import { AuthenticationRepository } from "../repositories/AuthenticationRepository";
import { RoomRepository } from "modules/room/repositories/RoomRepository";
import { RoomService } from "modules/room/services/RoomService";

export namespace UserEvents {
  export const UserRegisteredEvent = "user_registered";
  export interface UserRegisteredEventPayload {
    id: string;
    username: string;
  }
}

@injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private roomRepo: RoomRepository,
    private roomService: RoomService,
    private authRepo: AuthenticationRepository,
    private fileStorage: FileStorage,
    private pictureService: PictureService,
    private emitter: DomainEventEmitter
  ) {}

  async register(
    username: string,
    password: string,
    passwordConfirmation: string
  ) {
    username = this.normalizeUsername(username);

    const exists = await this.userRepo.findByUsername(username);
    if (exists) {
      return Bad("username_taken");
    }

    if (password !== passwordConfirmation) {
      return Bad("password_confirmation_mismatch");
    }

    const passwordHash = await bCrypt.hash(password, 10);
    const user: User = {
      id: uuid.v4(),
      username,
      creationDate: new Date(),
    };

    await this.userRepo.create(user);
    await this.authRepo.setCredentials({
      userId: user.id,
      passwordHash,
    });

    const firstRoom = await this.roomRepo.findFirst();
    if (firstRoom) {
      await this.roomService.join(firstRoom.id, user.id);
    }

    this.emitter.emit(UserEvents.UserRegisteredEvent, {
      id: user.id,
      username,
    } as UserEvents.UserRegisteredEventPayload);

    return Ok(user);
  }

  async update(
    id: string,
    user: { username?: string; picture?: UploadedFile }
  ) {
    let photoLocation: string | undefined;

    if (user.username) {
      user.username = this.normalizeUsername(user.username);
    }

    if (user.picture) {
      if (this.pictureService.isFileSupported(user.picture.type)) {
        const [picStream] = this.pictureService.resize(
          fs.createReadStream(user.picture.path),
          { width: 512, height: 512 }
        );

        assert(picStream);

        photoLocation = `photos/${id}${path.extname(user.picture.name)}`;

        await this.fileStorage.save(photoLocation, picStream);
      }
    }

    await this.userRepo.update({
      id,
      username: user.username,
      photoLocation,
    });
  }

  normalizeUsername(username: string): string {
    return username.trim().toLocaleLowerCase();
  }
}
