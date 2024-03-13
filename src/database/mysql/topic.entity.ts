import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { SubCategoryEntity } from "./sub-category.entity"
import { CourseTopicEntity } from "./course_topic.entity"

@ObjectType()
@Entity("topic")
export class TopicEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	    topicId: string

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 1000, nullable: true })
	    name: string

	@Field(() => Date)
	@CreateDateColumn()
	    createdAt: Date

	@Field(() => Date)
	@UpdateDateColumn()
	    updatedAt: Date

	@Field(() => SubCategoryEntity)
	@ManyToOne(() => SubCategoryEntity, (subCategory) => subCategory.topics)
	@JoinColumn({ name: "categoryId" })
	    subCategory: SubCategoryEntity

	@Field(() => [CourseTopicEntity])
	@OneToMany(() => CourseTopicEntity, (courseTopic) => courseTopic.topic)
	    courseTopics: Array<CourseTopicEntity>
}