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
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { CartProductEntity } from "./cart-product.enity"

@ObjectType()
@Entity("cart")
export class CartEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    cartId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    totalprice: number

    @Field(() => [CartProductEntity], { nullable: true })
    @OneToMany(() => CartProductEntity, (product) => product.cart)
    products: Array<CartProductEntity>;

    @Field(() => UserEntity)
    @OneToMany(() => UserEntity, (user) => user.cart, { onDelete: "CASCADE"})
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isDeleted: boolean

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

}
