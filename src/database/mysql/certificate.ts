import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne, 
    PrimaryGeneratedColumn} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CourseEntity } from "./course.entity"
import { AccountEntity } from "./account.entity"


@ObjectType()
@Entity("certificate")
export class CertificateEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    certificateId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    courseId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    accountId: string

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date, { nullable: true })
    @Column({ type: "date" , nullable: true })
    achievedDate: Date

    @Field(() => Date, { nullable: true })
    @Column({ type: "date" , nullable: true })
    expireDate: Date
    //relations

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.certificates)
    @JoinColumn({ name: "accountId" })
    account: AccountEntity

    @Field(() => CourseEntity, { nullable: true })
    @ManyToOne(() => CourseEntity, (course) => course.certificate)
    @JoinColumn({ name: "courseId" })
    course: CourseEntity

}
