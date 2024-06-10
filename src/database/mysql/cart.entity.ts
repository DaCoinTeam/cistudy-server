import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { UserEntity } from "./user.entity"
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { CartCourseEntity } from "./cart-course.enity"
import { OrderEntity } from "./order.entity"

@ObjectType()
@Entity("cart")
export class CartEntity {
    //Fields
    @Field(() => ID)
    @PrimaryColumn("uuid")
    cartId: string

    @Field(() => [CartCourseEntity], { nullable: true })
    @OneToMany(() => CartCourseEntity, (course) => course.cart)
    cartCourses: Array<CartCourseEntity>;

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isDeleted: boolean

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => UserEntity)
    @OneToOne(() => UserEntity, (user) => user.cart)
    @JoinColumn({ name: "cartId" })
    user: UserEntity
}
