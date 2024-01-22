import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("t_authentication_credentials")
export class tAuthenticationCredentials {
    @PrimaryColumn({ name: "user_id" })
    userId!: string;

    @Column({ name: "password_hash" })
    passwordHash!: string;
}
