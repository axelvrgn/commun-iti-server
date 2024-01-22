import { Request } from "express";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "server/middlewares/zodValidationMiddleware";
import { RoomRepository } from "modules/room/repositories/RoomRepository";
import {
  createRoomRequestSchema,
  roomParticipationSchema,
  roomQueryByIdSchema,
  searchRoomRequestSchema,
} from "./models/room";
import { RoomService } from "modules/room/services/RoomService";
import { authorize, readUserId } from "server/middlewares/bearer";
import { assert } from "modules/core/utils";
import { PaginationRequest, paginationRequestSchema } from "./models/common";

@controller("/room", authorize())
export class RoomController extends BaseHttpController {
  constructor(
    private roomService: RoomService,
    private roomRepo: RoomRepository
  ) {
    super();
  }

  @httpPost("/", validateBody(createRoomRequestSchema))
  async add(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    const result = await this.roomService.create(req.body.name, userId);
    if (!result.success) {
      return this.badRequest(result.reason);
    }

    return this.ok(result.value);
  }

  @httpPost("/join", validateBody(roomParticipationSchema))
  async join(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    const result = await this.roomService.join(req.body.roomId, userId);
    if (!result.success) {
      return this.badRequest(result.reason);
    }

    return this.ok();
  }

  @httpPost("/leave", validateBody(roomParticipationSchema))
  async leave(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    const result = await this.roomService.leave(req.body.roomId, userId);
    if (!result.success) {
      return this.badRequest(result.reason);
    }

    return this.ok();
  }

  @httpGet("/", validateQuery(paginationRequestSchema))
  async getUserRooms(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    return this.roomRepo.getPaginatedUserRooms(userId, {
      page: +req.query.page!,
      perPage: +req.query.perPage!,
    });
  }

  @httpGet("/exists", validateQuery(createRoomRequestSchema))
  async exists(req: Request): Promise<boolean> {
    const query = req.query as any;
    const room = await this.roomRepo.exists(query.name);

    return !!room;
  }

  @httpGet("/search", validateQuery(searchRoomRequestSchema))
  async searchAvailableRooms(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    return this.roomRepo.searchAvailable(userId, req.query.name as string);
  }

  @httpGet("/:id", validateParams(roomQueryByIdSchema))
  async findById(req: Request) {
    const room = await this.roomRepo.findById(req.params.id as string);
    return room;
  }
}
