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
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { CartEntity } from "./cart.entity"

@ObjectType()
@Entity("order")
export class OrderEntity {
    //Order Details (OrderId and CreateDate)
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    orderId: string

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    //Course Ordered (Courses, Total price)
    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    cartId: string

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    totalprice: number

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    discountprice: number
    //Billing Informations (User)

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    //relations
    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "userId" })
    user?: UserEntity

    @Field(() => CartEntity)
    @OneToOne(() => CartEntity, (cart) => cart.courses)
    @JoinColumn({ name: "cartId" })
    cart: CartEntity;
}
