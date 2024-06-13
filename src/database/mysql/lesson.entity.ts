import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from "typeorm"
import { SectionEntity } from "./section.entity"
import { ResourceEntity } from "./resource.entity"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { ProcessStatus, VideoType } from "@common"
import { QuizEntity } from "./quiz.entity"
import { ProgressEntity } from "./progress.entity"

@ObjectType()
@Entity("lesson")
export class LessonEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
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

    @Field(() => ID)
    @Column({ name: "sectionId", type: "uuid", length: 36 })
    sectionId: string

    @Field(() => String)
    @Column({ type: "enum", enum: ProcessStatus, default: ProcessStatus.Pending })
    processStatus: ProcessStatus

    @Field(() => String)
    @Column({ type: "enum", enum: VideoType, default: VideoType.MP4 })
    videoType: VideoType

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
    numberOfViews: number

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    description: string

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => SectionEntity)
    @ManyToOne(() => SectionEntity, (section) => section.lessons, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "sectionId" })
    section: SectionEntity

    @Field(() => [ResourceEntity])
    @OneToMany(() => ResourceEntity, (resource) => resource.lesson)
    resources: Array<ResourceEntity>

    @Field(() => [QuizEntity], { nullable: true })
    @OneToOne(() => QuizEntity, (quiz) => quiz.quizId, { nullable: true })
    quiz?: QuizEntity

    @Field(() => ProgressEntity)
    @OneToMany(() => ProgressEntity, (userProgress) => userProgress.lesson)
    userProgresses? : ProgressEntity
}
