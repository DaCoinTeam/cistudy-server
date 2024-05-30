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

import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { CartEntity } from "./cart.entity"


@ObjectType()
@Entity("cart-product")
export class CartProductEntity {
    //Main fields
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    productId: string

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
    @ManyToOne(() => CourseEntity, (course) => course.products, { onDelete: "CASCADE"})
    @JoinColumn({ name: "courseId" })
    course: CourseEntity;

    @Field(() => CartEntity)
    @ManyToOne(() => CartEntity, (cart) => cart.products, { onDelete: "CASCADE"})
    @JoinColumn({ name: "cartId" })
    cart: CartEntity;

}
