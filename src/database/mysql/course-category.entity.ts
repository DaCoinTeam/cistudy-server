import { Field, ID, ObjectType } from "@nestjs/graphql"
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm"
import { CategoryEntity } from "./category.entity"
import { CourseEntity } from "./course.entity"

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
    @ManyToOne(() => CourseEntity, (course) => course.courseCategories, {cascade: true})
    @JoinColumn({ name: "courseId" })
        course: CourseEntity

    @Field(() => CategoryEntity, {nullable: true})
    @ManyToOne(() => CategoryEntity, (category) => category.courseCategories, {onDelete: "CASCADE"})
    @JoinColumn({ name: "categoryId" })
        category: CategoryEntity
}