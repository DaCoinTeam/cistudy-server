import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn
} from "typeorm"

import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { SectionContentEntity } from "./section_content.entity"

@ObjectType()
@Entity("progress")
export class ProgressEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        progressId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        enrolledInfoId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        sectionContentId: string

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
        isCompleted: boolean

    @Field(() => SectionContentEntity)
    @ManyToOne(() => SectionContentEntity, (content) => content.accountProgresses, {onDelete: "CASCADE"} )
    @JoinColumn({ name: "sectionContentId" })
        content: SectionContentEntity

    @Field(() => EnrolledInfoEntity)
    @ManyToOne(() => EnrolledInfoEntity, (enrolledInfo) => enrolledInfo.courseProgress, {onDelete: "CASCADE"} )
    @JoinColumn({ name: "enrolledInfoId" })
        enrolledInfo: EnrolledInfoEntity

    @CreateDateColumn()
        createdAt: Date

    @UpdateDateColumn()
        updatedAt: Date

}
