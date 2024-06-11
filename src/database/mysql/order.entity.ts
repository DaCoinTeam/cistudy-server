import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { UserEntity } from "./user.entity"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { OrderCourseEntity } from "./order-course.entity"
import { OrderStatus } from "@common"

@ObjectType()
@Entity("order")
export class OrderEntity {
    //Order Details (OrderId and CreateDate)
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    orderId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    @Field(() => String)
    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
    orderStatus: OrderStatus

    @Field(() => [OrderCourseEntity], {nullable: true})
    @OneToMany(() => OrderCourseEntity, (orderCourse) => orderCourse.order)
    orderCourses: Array<OrderCourseEntity>

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date, { nullable: true })
    @Column({ type: "date", nullable: true })
    completeDate: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => Date, { nullable: true })
    @Column({ type: "datetime", nullable: true })
    paymentDue: Date

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isDeleted: Boolean

    //relations
    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "userId" })
    user: UserEntity
}
