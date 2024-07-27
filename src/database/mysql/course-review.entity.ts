import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { CourseEntity } from "./course.entity"

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
        accountId: string

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

    @Field(() => AccountEntity, {nullable: true})
    @ManyToOne(() => AccountEntity,(account) => account.courseReview ,{ nullable: true })
    @JoinColumn({ name: "accountId" })
        account: AccountEntity
}
