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
import { TopicEntity } from "./topic.entity"
import { SubcategoryEntity } from "./subcategory.entity"

@ObjectType()
@Entity("subcategory_topic")
export class SubcategoryTopicEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        subcategoryTopicId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date


    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        subcategoryId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        topicId: string

    @Field(() => SubcategoryEntity)
    @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.subcategoryTopics)
    @JoinColumn({ name: "subcategoryId" })
        subcategory: SubcategoryEntity


    @Field(() => TopicEntity)
    @ManyToOne(() => TopicEntity, (topic) => topic.subcategoryTopics)
    @JoinColumn({ name: "topicId" })
        topic: TopicEntity
}