import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"

import { LockState } from "@common"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { AccountGradeEntity } from "./account-grade.entity"
import { CourseEntity } from "./course.entity"
import { SectionContentEntity } from "./section_content.entity"

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
    @Field(() => String, { defaultValue:LockState.Locked })
        lockState?: LockState
}
