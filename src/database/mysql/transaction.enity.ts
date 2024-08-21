import { TransactionStatus, TransactionType } from "@common"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
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
import { AccountEntity } from "./account.entity"
import { TransactionDetailEntity } from "./transaction-detail.entity"
import { CourseEntity } from "./course.entity"

@ObjectType()
@Entity("transaction")
export class TransactionEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      transactionId: string

  @Field(() => String)
  @Column({ type: "enum", enum: TransactionType })
      type: TransactionType

  @Field(() => String)
  @Column({
      type: "enum",
      enum: TransactionStatus,
      default: TransactionStatus.Success,
  })
      status: TransactionStatus

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      accountId: string

  @Field(() => ID, { nullable: true })
  @Column({ type: "uuid", length: 36, nullable: true })
      courseId?: string

  @Field(() => Float)
  @Column({ type: "float", default: 0 })
      amountDepositedChange: number

  @Field(() => Float)
  @Column({ type: "float", default: 0 })
      amountOnChainChange: number

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 2000, nullable: true })
      transactionHash?: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 2000, nullable: true })
      payPalOrderId?: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 2000, nullable: true })
      preTextEarn?: string

  @Field(() => AccountEntity)
  @ManyToOne(() => AccountEntity, (course) => course.courseReview, {
      nullable: true,
  })
  @JoinColumn({ name: "accountId" })
      account: AccountEntity

  @Field(() => CourseEntity)
  @ManyToOne(() => CourseEntity, (course) => course.transactions, {
      nullable: true,
  })
  @JoinColumn({ name: "courseId" })
      course?: CourseEntity

  @Field(() => [TransactionDetailEntity])
  @OneToMany(
      () => TransactionDetailEntity,
      (transactionDetail) => transactionDetail.transaction,
      { nullable: true, cascade: true },
  )
      transactionDetails?: Array<TransactionDetailEntity>

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date
}
