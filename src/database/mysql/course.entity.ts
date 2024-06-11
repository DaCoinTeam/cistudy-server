import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
} from "typeorm"
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { VerifyStatus } from "@common"
import { PostEntity } from "./post.entity"
import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { SectionEntity } from "./section.entity"
import { UserEntity } from "./user.entity"
import { CourseTargetEntity } from "./course-target.entity"
import { CourseTopicEntity } from "./course-topic.entity"
import { CourseSubcategoryEntity } from "./course-subcategory.entity"
import { CategoryEntity } from "./category.entity"
import { CourseReviewEntity } from "./course-review.entity"
import { CartCourseEntity } from "./cart-course.enity"
import { CertificateEntity } from "./certificate"
import { OrderCourseEntity } from "./order-course.entity"


interface CourseIncludes {
    time: number;
}

@ObjectType()
@Entity("course")
export class CourseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    courseId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 1000, nullable: true })
    title: string

    @Field(() => ID, { nullable: true })
    @Column({
        type: "uuid",
        length: 36,
        default: null,
    })
    thumbnailId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 5000, nullable: true })
    description: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    creatorId: string

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    price: number

    @Field(() => Float, { defaultValue: 0 })
    @Column({ type: "float", default: 0 })
    discountPrice: number

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
    enableDiscount: boolean

    @Field(() => String)
    @Column({ type: "enum", enum: VerifyStatus, default: VerifyStatus.Pending })
    verifyStatus: VerifyStatus

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.courses)
    @JoinColumn({ name: "creatorId" })
    creator: UserEntity

    @Field(() => Boolean, { defaultValue: false })
    @Column({ default: false })
    isDeleted: boolean

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    receivedWalletAddress: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, default: null })
    previewVideoId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "json", default: null })
    includes: CourseIncludes

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => [CourseTopicEntity])
    @OneToMany(() => CourseTopicEntity, (courseTopic) => courseTopic.course, {
        cascade: true,
    })
    courseTopics: Array<CourseTopicEntity>

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, nullable: true })
    categoryId: string

    @Field(() => CategoryEntity, { nullable: true })
    @ManyToOne(() => CategoryEntity, (category) => category.courses)
    @JoinColumn({ name: "categoryId" })
    category: CategoryEntity

    @Field(() => [CourseSubcategoryEntity], { nullable: true })
    @OneToMany(() => CourseSubcategoryEntity, (courseSubcategory) => courseSubcategory.course, {
        cascade: true,
    })
    courseSubcategories: Array<CourseSubcategoryEntity>

    @Field(() => [CourseTargetEntity], { nullable: true })
    @OneToMany(() => CourseTargetEntity, (courseTarget) => courseTarget.course)
    courseTargets: Array<CourseTargetEntity>

    @Field(() => [PostEntity])
    @OneToMany(() => PostEntity, (post) => post.course)
    posts: Array<PostEntity>

    @OneToMany(() => EnrolledInfoEntity, (enrolled) => enrolled.course)
    enrolledInfos: Array<EnrolledInfoEntity>

    @Field(() => [SectionEntity])
    @OneToMany(() => SectionEntity, (section) => section.course, {
        onDelete: "CASCADE",
    })
    sections: Array<SectionEntity>

    @Field(() => [CartCourseEntity])
    @OneToMany(() => CartCourseEntity, (cartCourse) => cartCourse.course)
    cartCourses?: CartCourseEntity;

    @Field(() => [CertificateEntity])
    @OneToMany(() => CertificateEntity, (certificate) => certificate.course)
    certificate?: CertificateEntity;

    @Field(() => [OrderCourseEntity])
    @OneToMany(() => OrderCourseEntity, (orders) => orders.course)
    orderCourses: OrderCourseEntity

    @Field(() => CourseReviewEntity, { nullable: true })
    @OneToMany(() => CourseReviewEntity, (courseReview) => courseReview.course)
    courseReview?: CourseReviewEntity

    //graphql
    @Field(() => Int, { nullable: true })
    numberOfEnrollments?: number

    @Field(() => Boolean, { nullable: true })
    enrolled?: boolean

    @Field(() => Float, {nullable: true})
    courseProgress? : number

}
