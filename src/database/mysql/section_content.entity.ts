import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne
} from "typeorm"
import { LessonEntity } from "./lesson.entity"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { SectionContentType } from "@common"
import { SectionEntity } from "./section.entity"
import { QuizEntity } from "./quiz.entity"
import { ResourceEntity } from "./resource.entity"

@ObjectType()
@Entity("section_content")
export class SectionContentEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        sectionContentId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 200 })
        sectionId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 200 })
        title: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 , nullable: true})
        lessonId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36, nullable: true })
        quizId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36, nullable: true })
        resourceId: string

    @Field(() => String)
    @Column({ type: "enum", enum: SectionContentType })
        type: SectionContentType

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        position: number
        
    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => SectionEntity)
    @ManyToOne(() => SectionEntity, (section) => section.contents, { onDelete: "CASCADE" })
    @JoinColumn({ name: "sectionId" })
        section: SectionEntity

    @Field(() => LessonEntity, {nullable : true})
    @OneToOne(() => LessonEntity, (lesson) => lesson.sectionContent, {onDelete: "CASCADE"})
    @JoinColumn({ name: "lessonId" })
        lesson: LessonEntity

    @Field(() => QuizEntity, {nullable : true})
    @OneToOne(() => QuizEntity, (quiz) => quiz.sectionContent, {onDelete: "CASCADE"})
    @JoinColumn({ name: "quizId" })
        quiz: QuizEntity

    @Field(() => ResourceEntity, { nullable: true })
    @OneToOne(() => ResourceEntity, (resource) => resource.sectionContent, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "resourceId" })
        resource: ResourceEntity

}
