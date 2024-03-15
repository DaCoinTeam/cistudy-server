import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { SubcategoryEntity } from "./subcategory.entity"
import { CourseEntity } from "./course.entity"

@ObjectType()
@Entity("category")
export class CategoryEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        categoryId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 1000, nullable: true })
        name: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => [SubcategoryEntity])
    @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category)
        subcategories: Array<SubcategoryEntity>

    @Field(() => [CourseEntity])
    @OneToMany(() => CourseEntity, (course) => course.category)
        courses: Array<CourseEntity>
}