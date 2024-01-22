import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import { MessageService } from "modules/message/services/MessageService";
import { authorize, readUserId } from "server/middlewares/bearer";
import {
  validateBody,
  validateQuery,
} from "server/middlewares/zodValidationMiddleware";
import {
  SendMessageRequest,
  SetReactionRequest,
  getMessagesRequestSchema,
  removeReactionRequestSchema,
  sendMessageRequestSchema,
  setReactionRequestSchema,
} from "./models/message";
import { assert } from "modules/core/utils";
import { Request } from "express";
import { MessageRepository } from "modules/message/repository/MessageRepository";
import { SERVER_CONFIG } from "server/config/env";

@controller("/message", authorize())
export class MessageController extends BaseHttpController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageRepo: MessageRepository
  ) {
    super();
  }

  @httpPost("/", validateBody(sendMessageRequestSchema))
  async send(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    const messageReq = req.body as SendMessageRequest;

    const message = await this.messageService.send({
      authorId: userId,
      ...messageReq,
    });

    return {
      ...message,
      author: {
        ...message.author,
        pictureUrl: message.author.photoLocation
          ? `${SERVER_CONFIG.FILES_BASE_URL}/${message.author.photoLocation}`
          : undefined,
      },
    };
  }

  @httpPost("/react", validateBody(setReactionRequestSchema))
  async setReaction(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    const messageReq = req.body as SetReactionRequest;

    await this.messageService.reactTo({
      ...messageReq,
      userId,
    });
  }

  @httpPost("/remove-reaction", validateBody(removeReactionRequestSchema))
  async removeReaction(req: Request) {
    const userId = readUserId(req);
    assert(userId);

    await this.messageService.removeReaction(req.body.messageId, userId, req.body.emoji);
  }

  @httpGet("/", validateQuery(getMessagesRequestSchema))
  async getRoomMessages(req: Request) {
    const messages = await this.messageRepo.getPaginatedMessages(
      req.query.roomId as string,
      {
        page: +req.query.page!,
        perPage: +req.query.perPage!,
      }
    );

    messages.data.forEach((d) => {
      d.author.pictureUrl = d.author.photoLocation
        ? `${SERVER_CONFIG.FILES_BASE_URL}/${d.author.photoLocation}`
        : undefined;
    });

    return messages;
  }
}
