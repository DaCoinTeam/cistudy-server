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
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { AccountEntity } from "./account.entity"
import { SystemRoles } from "@common"


@ObjectType()
@Entity("role")
export class RoleEntity {
    //Main fields
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    roleId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    accountId: string

    @Field(() => String)
    @Column({ type: "enum", enum: SystemRoles})
    name: SystemRoles

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    isDisabled: Boolean;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    // Relations
    @Field(() => AccountEntity)
    @ManyToOne(
        () => AccountEntity,
        (account) => account.roles,
        { onDelete : "CASCADE" }
    )
    @JoinColumn({ name: "accountId" })
    accountRoles: AccountEntity;
}
