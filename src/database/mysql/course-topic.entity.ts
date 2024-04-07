import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CourseEntity } from "./course.entity"
import { TopicEntity } from "./topic.entity"

@ObjectType()
@Entity("course_topic")
export class CourseTopicEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        courseTopicId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        courseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        topicId: string

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.courseTopics)
    @JoinColumn({ name: "courseId" })
        course: CourseEntity


    @Field(() => TopicEntity)
    @ManyToOne(() => TopicEntity, (topic) => topic.courseTopics, { onDelete: "CASCADE" })
    @JoinColumn({ name: "topicId" })
        topic: TopicEntity

}