import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { UserEntity } from "./user.entity"



@ObjectType()
@Entity("notifications")
export class NotificationsEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    userNotificationId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    senderId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    receiverId: string

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    read: Boolean

    @Field(() => String)
    @Column({ type: "string", length: 2000 })
    title: string

    @Field(() => String, { nullable: true })
    @Column({ type: "string", length: 2000 })
    content: string

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    //relations

    // @Field(() => [UserEntity])
    // @ManyToOne(() => UserEntity, (user) => user.receiveNotifications)
    // @JoinColumn({ name: "receiverId" })
    // receiver: UserEntity;

    // @Field(() => [UserEntity])
    // @ManyToOne(() => UserEntity, (user) => user.sendNotifications)
    // @JoinColumn({ name: "senderId" })
    // sender: UserEntity;

}
