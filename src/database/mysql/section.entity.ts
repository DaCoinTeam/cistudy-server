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
import { LessonEntity } from "./lesson.entity"
import { CourseEntity } from "./course.entity"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

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
    @ManyToOne(() => CourseEntity, (course) => course.sections, {onDelete: "CASCADE"})
    @JoinColumn({ name: "courseId" })
        course: CourseEntity

    @Field(() => [LessonEntity], {nullable : true})
    @OneToMany(() => LessonEntity, (video) => video.section, { cascade: true })
        lessons: Array<LessonEntity>

}
