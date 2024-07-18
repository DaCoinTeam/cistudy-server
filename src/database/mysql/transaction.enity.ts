import { TransactionType } from "@common"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    JoinColumn,
    ManyToOne,
} from "typeorm"
import { AccountEntity } from "./account.entity"

@ObjectType()
@Entity("transaction")
export class TransactionEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      transactionId: string

  @Field(() => String)
  @Column({ type: "enum", enum: TransactionType })
      type: TransactionType

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      accountId: string

  @Field(() => Float)
  @Column({ type: "float", default: 0 })
      amountDepositedChange: number

  @Field(() => Float)
  @Column({ type: "float", default: 0 })
      amountOnChainChange: number

  @Field(() => String, { nullable: true})
  @Column({ type: "varchar", length: 2000, nullable: true })
      transactionHash?: string

  @Field(() => String, { nullable: true})
  @Column({ type: "varchar", length: 2000, nullable: true })
      payPalOrderId?: string

  @Field(() => AccountEntity)
  @ManyToOne(() => AccountEntity, (course) => course.courseReview, {
      nullable: true,
  })
  @JoinColumn({ name: "accountId" })
      account: AccountEntity

  @CreateDateColumn()
      createdAt: Date

  @UpdateDateColumn()
      updatedAt: Date
}
