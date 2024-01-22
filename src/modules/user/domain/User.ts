export interface User extends UserInfo {
    creationDate: Date;
    photoLocation?: string;
}

export interface UserInfo {
    id: string;
    username: string;
    pictureUrl?: string;
}