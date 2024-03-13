import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "./category.entity"
import { SubcategoryTopicEntity } from "./subcategory-topic.entity"
import { CourseSubcategoryEntity } from "./course-subcategory.entity"

@ObjectType()
@Entity("subcategory")
export class SubcategoryEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        subcategoryId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 1000, nullable: true })
        name: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        categoryId: string

    @Field(() => CategoryEntity)
    @ManyToOne(() => CategoryEntity, (category) => category.subcategories)
    @JoinColumn({ name: "categoryId" })
        category: CategoryEntity

    @Field(() => [SubcategoryTopicEntity])
    @OneToMany(() => SubcategoryTopicEntity, (subcategoryTopic) => subcategoryTopic.subcategory)
        subcategoryTopics: Array<SubcategoryTopicEntity>

    @Field(() => [CourseSubcategoryEntity])
        @OneToMany(() => CourseSubcategoryEntity, (courseSubcategory) => courseSubcategory.subcategory)
        courseSubcategories: Array<CourseSubcategoryEntity>
}
