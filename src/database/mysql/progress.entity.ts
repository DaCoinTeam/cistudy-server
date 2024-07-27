import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"

import { CompleteState } from "@common"
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

    @Field(() => String)
    @Column({ type: "enum", enum: CompleteState, default: CompleteState.Undone })
        completeState: CompleteState

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
