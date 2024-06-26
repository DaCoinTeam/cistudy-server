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
import { CourseEntity } from "./course.entity"

import { Field, ID, ObjectType } from "@nestjs/graphql"
import { AccountRoleEntity } from "./account-role.entity"


@ObjectType()
@Entity("role")
export class RoleEntity {
    //Main fields
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    roleId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    name: string

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
    @Field(() => [AccountRoleEntity])
    @OneToMany(
        () => AccountRoleEntity, 
        (accountRole) => accountRole.role,
        {cascade: true}
    )
    accountRoles: Array<AccountRoleEntity>;
}
