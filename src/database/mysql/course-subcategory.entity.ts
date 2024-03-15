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
import { SubcategoryEntity } from "./subcategory.entity"

@ObjectType()
@Entity("course_subcategory")
export class CourseSubcategoryEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        courseSubcategoryId: string

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
        subcategoryId: string

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.courseSubcategories)
    @JoinColumn({ name: "courseId" })
        course: CourseEntity


    @Field(() => SubcategoryEntity)
    @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.courseSubcategories)
    @JoinColumn({ name: "subcategoryId" })
        subcategory: SubcategoryEntity
}