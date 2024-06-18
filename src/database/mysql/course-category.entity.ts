import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { CourseEntity } from "./course.entity"
import { CategoryEntity } from "./category.entity"

@ObjectType()
@Entity("course-category")
export class CourseCategoryEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        courseCategoryId: string

    @Field(() => ID)
    @Column({ type: "uuid" })
        courseId: string

    @Field(() => ID)
    @Column({ type: "uuid" })
        categoryId: string
    

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.courseCategories)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity

    @Field(() => CategoryEntity)
    @ManyToOne(() => CategoryEntity, (category) => category.courseCategories)
    @JoinColumn({ name: "categoryId" })
    category: CategoryEntity
}