import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { SectionEntity } from "./section.entity"
import { ResourceEntity } from "./resource.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
@Entity("lecture")
export class LectureEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      lectureId: string

  @Field(() => String)
  @Column({ type: "varchar", length: 150 })
      title: string

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      thumbnailId: string

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      lectureVideoId: string

  @Field(() => String)
  @Column({ name: "sectionId", type: "uuid", length: 36 })
      sectionId: string

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => SectionEntity)
  @ManyToOne(() => SectionEntity, (section) => section.lectures)
  @JoinColumn({ name: "sectionId" })
      section: SectionEntity

  @Field(() => [ResourceEntity])
  @OneToMany(() => ResourceEntity, (resource) => resource.lecture)
      resources: Array<ResourceEntity>
}
