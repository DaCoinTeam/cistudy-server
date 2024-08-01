import { ReportProcessStatus } from "@common"
import { Field, ID, ObjectType } from "@nestjs/graphql"
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

@ObjectType()
@Entity("report-account")
export class ReportAccountEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        reportAccountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        reporterId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        reportedId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 100, nullable: true })
        title: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 200, nullable: true })
        description: string

    @Field(() => String)
    @Column({ type: "enum", enum: ReportProcessStatus, default: ReportProcessStatus.Processing })
        processStatus: ReportProcessStatus

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 2000, nullable: true })
        processNote: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.reportAccounts, { nullable: true })
    @JoinColumn({ name: "reporterId" })
        reporterAccount: AccountEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.accountReports, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "reportedId" })
        reportedAccount: AccountEntity
}
/*
report_id	UUID	PRIMARY KEY
reporter_id	UUID	NOT NULL, FOREIGN KEY REFERENCES Accounts(account_id)
report_type	ENUM	NOT NULL, values: 'COURSE', 'ACCOUNT', 'POST', 'COMMENT'
reported_id	UUID	NOT NULL
description	TEXT	
created_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP
updated_at	TIMESTAMP	NOT NULL, DEFAULT CURRENT_TIMESTAMP
*/
