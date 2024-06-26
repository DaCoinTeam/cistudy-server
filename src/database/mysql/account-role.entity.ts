import {
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "./category.entity"
import { AccountEntity } from "./account.entity"
import { RoleEntity } from "./role.entity"

@ObjectType()
@Entity("account-role")
export class AccountRoleEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    accountRoleId: string

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    accountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    roleId: string

    @Field(() => AccountEntity, { nullable: true })
    @ManyToOne(
        () => AccountEntity,
        (account) => account.accountRoles,
        { onDelete: "CASCADE" })
    @JoinColumn({ name: "accountId" })
    account: AccountEntity

    @Field(() => RoleEntity, { nullable: true })
    @ManyToOne(
        () => RoleEntity,
        (role) => role.accountRoles,
        { onDelete: "CASCADE", onUpdate: "CASCADE" },
    )
    @JoinColumn({ name: "roleId" })
    role: RoleEntity
}
