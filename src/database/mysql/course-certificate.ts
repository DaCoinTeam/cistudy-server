import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { UserEntity } from "./user.entity"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { CartEntity } from "./cart.entity"
import { CourseEntity } from "./course.entity"

@ObjectType()
@Entity("course-certificate")
export class CourseCertificateEntity {
    
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    certificateId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    courseId: string

    @Field(() => Date, { nullable: true })
    @Column({ type: "date"})
    achievedDate?: Date
    
    @Field(() => Date, {nullable: true})
    @Column({ type: "date"})
    expireDate?: Date


    

    //relations
    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "userId" })
    user?: UserEntity

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.cartCourses, { onDelete: "CASCADE"})
    @JoinColumn({ name: "courseId" })
    course: CourseEntity;
    
    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date
}
