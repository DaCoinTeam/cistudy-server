import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { SectionEntity } from "./section.entity"

@ObjectType()
@Entity("account-grade")
export class AccountGradeEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        accountGradeId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        enrolledInfoId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        sectionId: string

    @Field(() => Int, { defaultValue: 0 })
    @Column({ type: "int", default: 0 })
        grade: number

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => EnrolledInfoEntity)
    @ManyToOne(() => EnrolledInfoEntity, (enrolledInfo) => enrolledInfo.accountGrade, { onDelete: "CASCADE" } )
    @JoinColumn({ name: "enrolledInfoId" })
        enrolledInfo: EnrolledInfoEntity

    @Field(() => SectionEntity)
    @ManyToOne(() => SectionEntity, (section) => section.accountGrade ,{ onDelete: "CASCADE",nullable: true })
    @JoinColumn({ name: "sectionId" })
        section: SectionEntity
}
