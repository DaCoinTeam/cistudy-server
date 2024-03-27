import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { UserEntity } from "./user.entity"
import { CourseEntity } from "./course.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
@Entity("enrolled_info")
export class EnrolledInfoEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        enrolledInfoId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        userId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        courseId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => Boolean)
    @Column({ type: "boolean", default: true })
        enrolled: boolean

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.enrolledInfos)
    @JoinColumn({ name: "courseId" })
        course: CourseEntity

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.enrolledInfos)
    @JoinColumn({ name: "userId" })
        user: UserEntity
}
