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
import { Field, Float, ID, ObjectType, Int } from "@nestjs/graphql"
import { CourseEntity } from "./course.entity"
import { UserEntity } from "./user.entity"

@ObjectType()
@Entity("course-review")
export class CourseReviewEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        courseReviewId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        courseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        userId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 200, nullable: true })
        content: string

    @Field(() => Int, { defaultValue: 0 })
    @Column({ type: "int", default: 0 })
        rating: number

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity,(course) => course.courseReview ,{ nullable: true })
    @JoinColumn({ name: "courseId" })
    course: CourseEntity

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity,(user) => user.courseReview ,{ nullable: true })
    @JoinColumn({ name: "userId" })
    user: UserEntity
}
