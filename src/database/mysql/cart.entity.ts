import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CartCourseEntity } from "./cart-course.enity"

@ObjectType()
@Entity("cart")
export class CartEntity {
    //Fields
    @Field(() => ID)
    @PrimaryColumn("uuid")
        cartId: string

    @Field(() => [CartCourseEntity], { nullable: true })
    @OneToMany(() => CartCourseEntity, (course) => course.cart)
        cartCourses: Array<CartCourseEntity>

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
        isDeleted: boolean

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @OneToOne(() => AccountEntity, (account) => account.cart)
    @JoinColumn({ name: "cartId" })
        account: AccountEntity
}
