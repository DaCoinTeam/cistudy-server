import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { UserEntity } from "./user.entity"

@ObjectType()
@Entity("crypto-wallet")
export class CryptoWalletEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        cryptoWalletId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 100 })
        address: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        userId: string

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.cryptoWallets, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "userId" })
        user: UserEntity
}
