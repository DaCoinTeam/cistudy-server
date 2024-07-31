import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { AccountEntity } from "./account.entity"

@ObjectType()
@Entity("notification")
export class NotificationEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        notificationId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 , nullable: true })
        senderId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        receiverId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 100, nullable: true })
        title: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 200, nullable: true })
        description: string
    
    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 100, nullable: true })
        referenceLink: string

    @Field(() => Boolean)
    @Column({ type: "boolean", default: false })
        viewed: boolean

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.sentNotifications, { nullable: true })
    @JoinColumn({ name: "senderId" })
        notificationSent: AccountEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.receiveNotifications, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "receiverId" })
        notificationReceive: AccountEntity
}
