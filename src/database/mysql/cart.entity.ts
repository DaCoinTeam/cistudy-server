import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
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
    @PrimaryGeneratedColumn("uuid")
    cartId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    totalprice: number

    @Field(() => [CartCourseEntity], { nullable: true })
    @OneToMany(() => CartCourseEntity, (product) => product.cart)
    courses: Array<CartCourseEntity>;

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isDeleted: boolean

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    //relations
    @Field(() => UserEntity)
    @OneToMany(() => UserEntity, (user) => user.cart, { onDelete: "CASCADE"})
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @Field(() => OrderEntity)
    @OneToOne(() => OrderEntity, (order) => order.cart)
    order: OrderEntity;

}
