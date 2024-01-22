import { Container } from "inversify";
import { DomainEventEmitter } from "modules/core/DomainEventEmitter";
import { emitter } from "./emitter";
import { OpenGraphReader } from "modules/core/OpenGraphReader";

export const rootContainer = new Container();
rootContainer.bind(DomainEventEmitter).toConstantValue(emitter);
rootContainer.bind(OpenGraphReader).toSelf();
