import { CertificateStatus, CourseVerifyStatus } from "@common"
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { CourseCategoryLevel, CourseRating } from "../dto"
import { AccountEntity } from "./account.entity"
import { CartCourseEntity } from "./cart-course.enity"
import { CertificateEntity } from "./certificate"
import { CourseCategoryEntity } from "./course-category.entity"
import { CourseReviewEntity } from "./course-review.entity"
import { CourseTargetEntity } from "./course-target.entity"
import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { OrderCourseEntity } from "./order-course.entity"
import { PostEntity } from "./post.entity"
import { ReportCourseEntity } from "./report-course.entity"
import { SectionEntity } from "./section.entity"
import { NotificationEntity } from "./notification.entity"
import { TransactionDetailEntity } from "./transaction-detail.entity"
import { TransactionEntity } from "./transaction.enity"

interface CourseIncludes {
  time: number
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
  @Column({
      type: "enum",
      enum: CourseVerifyStatus,
      default: CourseVerifyStatus.Draft,
  })
      verifyStatus: CourseVerifyStatus

  @Field(() => AccountEntity)
  @ManyToOne(() => AccountEntity, (account) => account.courses)
  @JoinColumn({ name: "creatorId" })
      creator: AccountEntity

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

  @Field(() => Int, { defaultValue: 12 })
  @Column({ type: "int", default: 12 })
      duration: number

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 2000, nullable: true })
      previousFeedback: string

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => [CourseCategoryEntity], { nullable: true })
  @OneToMany(
      () => CourseCategoryEntity,
      (courseCategory) => courseCategory.course,
  )
      courseCategories: Array<CourseCategoryEntity>

  @Field(() => [CourseTargetEntity], { nullable: true })
  @OneToMany(() => CourseTargetEntity, (courseTarget) => courseTarget.course)
      courseTargets: Array<CourseTargetEntity>

  @Field(() => [PostEntity], { nullable: true })
  @OneToMany(() => PostEntity, (post) => post.course)
      posts: Array<PostEntity>

  @Field(() => [EnrolledInfoEntity], { nullable: true })
  @OneToMany(() => EnrolledInfoEntity, (enrolled) => enrolled.course)
      enrolledInfos: Array<EnrolledInfoEntity>

  @Field(() => [SectionEntity], { nullable: true })
  @OneToMany(() => SectionEntity, (section) => section.course, {
      onDelete: "CASCADE",
  })
      sections: Array<SectionEntity>

  @Field(() => [CartCourseEntity])
  @OneToMany(() => CartCourseEntity, (cartCourse) => cartCourse.course)
      cartCourses?: Array<CartCourseEntity>

  @Field(() => [CertificateEntity])
  @OneToMany(() => CertificateEntity, (certificate) => certificate.course)
      certificates?: Array<CertificateEntity>

  @Field(() => [OrderCourseEntity])
  @OneToMany(() => OrderCourseEntity, (orders) => orders.course)
      orderCourses: Array<OrderCourseEntity>

  @Field(() => [CourseReviewEntity], { nullable: true })
  @OneToMany(() => CourseReviewEntity, (courseReview) => courseReview.course)
      courseReviews?: Array<CourseReviewEntity>

  @Field(() => [ReportCourseEntity], { nullable: true })
  @OneToMany(
      () => ReportCourseEntity,
      (reportCourse) => reportCourse.reportedCourse,
      { nullable: true },
  )
      courseReports?: Array<ReportCourseEntity>

  @Field(() => [NotificationEntity], { nullable: true })
  @OneToMany(() => NotificationEntity, (notification) => notification.course, {
      nullable: true,
  })
      courseNotifications?: Array<NotificationEntity>

  @Field(() => [TransactionDetailEntity], { nullable: true })
  @OneToMany(
      () => TransactionDetailEntity,
      (transactionDetail) => transactionDetail.course,
      { nullable: true },
  )
      transactionDetails?: Array<TransactionDetailEntity>

  @Field(() => [TransactionEntity], { nullable: true })
  @OneToMany(() => TransactionEntity, (transaction) => transaction.course, {
      nullable: true,
  })
      transactions?: Array<TransactionEntity>

  //graphql
  @Field(() => Int, { nullable: true })
      numberOfEnrollments?: number

  @Field(() => Boolean, { nullable: true })
      enrolled?: boolean

  @Field(() => Boolean, { nullable: true })
      isReviewed?: boolean

  @Field(() => Boolean, { nullable: true })
      isCreator?: boolean

  @Field(() => Float, { nullable: true })
      courseProgress?: number

  @Field(() => Int, { nullable: true })
      numberOfRewardedPostsLeft?: number

  @Field(() => CourseRating, { nullable: true })
      courseRatings: CourseRating

  @Field(() => CourseCategoryLevel, { nullable: true })
      courseCategoryLevels: CourseCategoryLevel

  @Field(() => Int, { nullable: true })
      numberOfQuizzes?: number

  @Field(() => Int, { nullable: true })
      numberOfLessons?: number

  @Field(() => Int, { nullable: true })
      numberOfResources?: number

  @Field(() => String, { nullable: true })
      certificateStatus?: CertificateStatus

  @Field(() => CertificateEntity, { nullable: true })
      certificate?: CertificateEntity

  @Field(() => Boolean, { nullable: true })
      isReported?: boolean

  @Field(() => Int, { nullable: true })
      numberOfReports?: number

  @Field(() => Int, { nullable: true })
      totalContents?: number
  @Field(() => Int, { nullable: true })
      completedContents?: number
  @Field(() => [AccountEntity], { nullable: true })
      students?: Array<AccountEntity>
  @Field(() => Boolean, { nullable: true })
      isAddedToCart?: boolean
}
