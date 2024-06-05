import {
    Column, Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn
} from "typeorm"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { OrderEntity } from "./order.entity"
import { CourseEntity } from "./course.entity"

@ObjectType()
@Entity("order-courses")
export class OrderCoursesEntity {
    //Order Details (OrderId and CreateDate)
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    orderCourseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    orderId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    courseId: string

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    discountPrice: number

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    price: number

    @Field(() => OrderEntity)
    @ManyToOne(() => OrderEntity, (order) => order.orderCourses)
    @JoinColumn({ name: "orderId" })
    order: OrderEntity

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (orderCourse) => orderCourse.orders)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity
}
