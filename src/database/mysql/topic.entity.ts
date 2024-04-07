import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CourseTopicEntity } from "./course-topic.entity"
import { SubcategoryTopicEntity } from "./subcategory-topic.entity"

@ObjectType()
@Entity("topic")
export class TopicEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	    topicId: string

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 1000, nullable: true })
	    name: string

	@Field(() => String)
	@Column({ type: "uuid", length: 36})
	    svgId: string

	@Field(() => Date)
	@CreateDateColumn()
	    createdAt: Date

	@Field(() => Date)
	@UpdateDateColumn()
	    updatedAt: Date

	@Field(() => [CourseTopicEntity])
	@OneToMany(() => CourseTopicEntity, (courseTopic) => courseTopic.topic, {
	    cascade: true
	})
	    courseTopics: Array<CourseTopicEntity>
	
	@Field(() => [SubcategoryTopicEntity])
	@OneToMany(() => SubcategoryTopicEntity, (subcategoryTopic) => subcategoryTopic.topic, {
	    cascade: true
	})
	    subcategoryTopics: Array<SubcategoryTopicEntity>
}