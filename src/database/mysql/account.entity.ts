import { AccountKind, InstructorStatus } from "@common"
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    JoinColumn, 
    OneToMany, 
    OneToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm"
import { AccountRating } from "../dto/account-rating.dto"
import { AccountReviewEntity } from "./account-review.entity"
import { CartEntity } from "./cart.entity"
import { CertificateEntity } from "./certificate"
import { CourseReviewEntity } from "./course-review.entity"
import { CourseEntity } from "./course.entity"
import { CryptoWalletEntity } from "./crypto-wallet.entity"
import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { FollowEntity } from "./follow.entity"
import { OrderEntity } from "./order.entity"
import { PostCommentEntity } from "./post-comment.entity"
import { PostLikeEntity } from "./post-like.entity"
import { PostEntity } from "./post.entity"
import { QuizAttemptEntity } from "./quiz-attempt.entity"
import { ReportAccountEntity } from "./report-account.entity"
import { RoleEntity } from "./role.entity"
import { SessionEntity } from "./session.entity"
import { CompleteResourceEntity } from "./complete-resource.entity"
import { ProgressEntity } from "./progress.entity"
import { NotificationEntity } from "./notification.entity"
import { TransactionDetailEntity } from "./transaction-detail.entity"
import { AccountQualificationEntity } from "./account-qualification.entity"
import { AccountJobEntity } from "./account-job.entity"


@ObjectType()
@Entity("account")
export class AccountEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        accountId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 50, default: null })
        email: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 64, default: null })
        password: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, default: null })
        avatarId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 200, default: null })
        avatarUrl: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, default: null })
        coverPhotoId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 12, default: null })
        phoneNumber: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 60, default: null })
        username: string

    @Field(() => Float, { nullable: true })
    @Column({
        type: "float",
        default: 0,
    })
        balance: number

    @Field(() => String, { nullable: true })
    @Column({
        type: "varchar",
        length: 100,
        default: null
    })
        walletAddress: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 2000, default: null })
        bio: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 50, default: null })
        firstName: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 50, default: null })
        lastName: string

    @Field(() => Date, { nullable: true })
    @Column({ type: "date", default: null })
        birthdate: Date

    @Field(() => Boolean)
    @Column({ type: "boolean", default: false })
        verified: boolean
    
    @Field(() => Boolean)
    @Column({ type: "boolean", default: false })
        isDisabled: boolean

    @Field(() => String)
    @Column({
        type: "enum",
        enum: AccountKind,
        default: AccountKind.Local,
    })
        kind: AccountKind

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 128, default: null })
        externalId: string

    @OneToMany(() => SessionEntity, (session) => session.account)
        sessions: Array<SessionEntity>

    @OneToMany(() => PostCommentEntity, (postComment) => postComment.creator)
        postComments: Array<PostCommentEntity>

    @OneToMany(() => PostLikeEntity, (postReact) => postReact.account)
        postReacts: Array<PostLikeEntity>

    @OneToMany(() => EnrolledInfoEntity, (enrolledInfo) => enrolledInfo.account)
        enrolledInfos: Array<EnrolledInfoEntity>

    @Field(() => [RoleEntity], { nullable: true })
    @OneToMany(
        () => RoleEntity,
        (role) => role.accountRoles,
    )
        roles: Array<RoleEntity>

    @Field(() => [CryptoWalletEntity])
    @OneToMany(() => CryptoWalletEntity, (cryptoWallet) => cryptoWallet.account)
        cryptoWallets: Array<CourseEntity>

    @Field(() => [PostEntity])
    @OneToMany(() => PostEntity, (post) => post.creator)
        posts: Array<PostEntity>

    @Field(() => [CourseEntity])
    @OneToMany(() => CourseEntity, (course) => course.creator)
        courses: Array<CourseEntity>

    @Field(() => [FollowEntity])
    @OneToMany(() => FollowEntity, (account) => account.follower)
        followerRelations: Array<FollowEntity>

    @Field(() => [FollowEntity])
    @OneToMany(() => FollowEntity, (account) => account.followedAccount)
        followedAccountRelations: Array<FollowEntity>

    @Field(() => [CourseReviewEntity], { nullable: true })
    @OneToMany(() => CourseReviewEntity, (courseReview) => courseReview.account, { nullable: true })
        courseReview: Array<CourseReviewEntity>

    @Field(() => CartEntity, { nullable: true })
    @OneToOne(() => CartEntity, (cart) => cart.cartId, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "cartId" })
        cart: CartEntity

    @Field(() => [OrderEntity])
    @OneToMany(() => OrderEntity, (orders) => orders.account)
        orders: Array<OrderEntity>

    @Field(() => [CertificateEntity])
    @OneToMany(() => CertificateEntity, (certificates) => certificates.account, { nullable: true })
        certificates?: Array<CertificateEntity>

    @Field(() => [QuizAttemptEntity])
    @OneToMany(() => QuizAttemptEntity, (quizAttempts) => quizAttempts.account, { nullable: true })
        quizAttempts?: Array<QuizAttemptEntity>

    @Field(() => [AccountReviewEntity])
    @OneToMany(() => AccountReviewEntity, (accountReviews) => accountReviews.account, { nullable: true })
        accountReviews?: Array<AccountReviewEntity>

    @Field(() => [AccountReviewEntity])
    @OneToMany(() => AccountReviewEntity, (selfReviews) => selfReviews.reviewedAccount, { nullable: true })
        selfReviews?: Array<AccountReviewEntity>

    @Field(() => [ReportAccountEntity])
    @OneToMany(() => ReportAccountEntity, (reportAccounts) => reportAccounts.reportedAccount, { nullable: true })
        reportAccounts?: Array<ReportAccountEntity>

    @Field(() => [ReportAccountEntity])
    @OneToMany(() => ReportAccountEntity, (accountReports) => accountReports.reporterAccount, { nullable: true })
        accountReports?: Array<ReportAccountEntity>

    @Field(() => [AccountJobEntity])
    @OneToMany(() => AccountJobEntity, (accountJobs) => accountJobs.account, { nullable: true })
        accountJobs?: Array<AccountJobEntity>
    
    @Field(() => [AccountQualificationEntity])
    @OneToMany(() => AccountQualificationEntity, (accounQualifications) => accounQualifications.account, { nullable: true })
        accountQualifications?: Array<AccountQualificationEntity>
    
    @Field(() => [CompleteResourceEntity])
    @OneToMany(() => CompleteResourceEntity, (completeResource) => completeResource.account, { nullable: true })
        completeResources?: Array<CompleteResourceEntity>

    @Field(() => [ProgressEntity])
    @OneToMany(() => ProgressEntity, (courseProgress) => courseProgress.account)
        courseProgress: Array<ProgressEntity>
        
    @Field(() => [NotificationEntity])
    @OneToMany(() => NotificationEntity, (notification) => notification.sender, { nullable: true })
        sentNotifications?: Array<NotificationEntity>

    @Field(() => [NotificationEntity])
    @OneToMany(() => NotificationEntity, (notification) => notification.receiver, { nullable: true })
        receiveNotifications?: Array<NotificationEntity>
    
    @Field(() => [TransactionDetailEntity], { nullable: true },)
    @OneToMany(() => TransactionDetailEntity, (transactionDetail) => transactionDetail.account, { nullable: true })
        transactionDetails?: Array<TransactionDetailEntity>

    @Field(() => String)
    @Column({ type: "enum", enum: InstructorStatus, default: InstructorStatus.NotRegistered })
        instructorStatus: InstructorStatus

    //graphql
    @Field(() => Boolean)
        followed?: boolean
    @Field(() => Int)
        numberOfFollowers?: number
    @Field(() => AccountRating, {nullable : true})
        accountRatings : AccountRating
    @Field(() => Boolean, {nullable : true})
        isReported? : boolean
    @Field(() => Int, { nullable: true })
        numberOfReports?: number
}
