export namespace RoomEvents {
  export const RoomCreatedEvent = "new_room_created";
  export interface RoomCreatedEventPayload {
    roomId: string;
    creatorId: string;
    name: string;
  }

  export const RoomJoinedEvent = "room_joined";
  export interface RoomJoinedEventPayload {
    roomId: string;
    name: string;
    userId: string;
  }

  export const RoomLeftEvent = "room_left";
  export interface RoomLeftEventPayload {
    roomId: string;
    userId: string;
    name: string;
  }
}
