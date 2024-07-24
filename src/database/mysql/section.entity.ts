import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

import { CourseEntity } from "./course.entity"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { SectionContentEntity } from "./section_content.entity"
import { AccountGradeEntity } from "./account-grade.entity"
import { LockState } from "@common"

@ObjectType()
@Entity("section")
export class SectionEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        sectionId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 200 })
        title: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        courseId: string

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        position: number
        
    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => CourseEntity)
    @ManyToOne(() => CourseEntity, (course) => course.sections, { onDelete: "CASCADE" })
    @JoinColumn({ name: "courseId" })
        course: CourseEntity

    @Field(() => [SectionContentEntity], {nullable : true})
    @OneToMany(() => SectionContentEntity, (content) => content.section, { cascade: true })
        contents: Array<SectionContentEntity>

    @Field(() => [AccountGradeEntity], {nullable : true})
    @OneToMany(() => AccountGradeEntity, (grade) => grade.section, { cascade: true })
        accountGrade: Array<AccountGradeEntity>

    //graphQL
    @Field(() => Boolean)
        isCompleted?: boolean
    @Field(() => LockState, { nullable : true })
        lockState?: LockState
}
