import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    PrimaryColumn,
} from "typeorm"

import { ResourceEntity } from "./resource.entity"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { ProcessStatus, VideoType } from "@common"
import { ProgressEntity } from "./progress.entity"
import { SectionContentEntity } from "./section_content.entity"

@ObjectType()
@Entity("lesson")
export class LessonEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
        lessonId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 150 })
        title: string

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

    @Field(() => [ResourceEntity])
    @OneToMany(() => ResourceEntity, (resource) => resource.lesson)
        resources: Array<ResourceEntity>

    @Field(() => [ProgressEntity])
    @OneToMany(() => ProgressEntity, (accountProgress) => accountProgress.lesson)
        accountProgresses? : Array<ProgressEntity>
}
