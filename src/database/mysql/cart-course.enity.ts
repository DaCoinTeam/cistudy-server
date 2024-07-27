import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { CourseEntity } from "./course.entity"

import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CartEntity } from "./cart.entity"


@ObjectType()
@Entity("cart-course")
export class CartCourseEntity {
    //Main fields
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        cartCourseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        cartId: string
    
    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        courseId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date
    // Relations
    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.cartCourses)
    @JoinColumn({ name: "courseId" })
        course: CourseEntity

    @Field(() => CartEntity)
    @ManyToOne(() => CartEntity, (cart) => cart.cartCourses, { onDelete: "CASCADE"})
    @JoinColumn({ name: "cartId" })
        cart: CartEntity

}
