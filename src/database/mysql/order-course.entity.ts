import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import {
    Column, 
    CreateDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { CourseEntity } from "./course.entity"
import { OrderEntity } from "./order.entity"

@ObjectType()
@Entity("order-course")
export class OrderCourseEntity {
    //Order Details (OrderId and CreateDate)
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        orderCourseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        courseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        orderId: string

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
        discountedPrice: number

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
        price: number

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date
        
    @Field(() => OrderEntity)
    @ManyToOne(() => OrderEntity, (order) => order.orderCourses, {onDelete: "CASCADE"})
    @JoinColumn({ name: "orderId" })
        order: OrderEntity

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.orderCourses)
    @JoinColumn({ name: "courseId" })
        course: CourseEntity
}
