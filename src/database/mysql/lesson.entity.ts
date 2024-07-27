import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm"

import { ProcessStatus, VideoType } from "@common"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { SectionContentEntity } from "./section_content.entity"

@ObjectType()
@Entity("lesson")
export class LessonEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
        lessonId: string
        
    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, nullable: true })
        thumbnailId?: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, nullable: true })
        lessonVideoId?: string

    @Field(() => String)
    @Column({ type: "enum", enum: ProcessStatus, default: ProcessStatus.Pending })
        processStatus: ProcessStatus

    @Field(() => String)
    @Column({ type: "enum", enum: VideoType, default: VideoType.MP4 })
        videoType: VideoType

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        numberOfViews: number

    @Field(() => Int)
    @Column({ type: "int", default: 0 , nullable: true })
        durationInSeconds: number

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
        description: string
        
    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => SectionContentEntity)
    @OneToOne(() => SectionContentEntity, (sectionContent) => sectionContent.lesson, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "lessonId" })
        sectionContent: SectionContentEntity

}
