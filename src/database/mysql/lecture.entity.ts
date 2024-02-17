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
import { ProcessStatus, VideoType } from "@common"

@ObjectType()
@Entity("lecture")
export class LectureEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      lectureId: string

  @Field(() => String)
  @Column({ type: "varchar", length: 150 })
      title: string

  @Field(() => String, { nullable: true })
  @Column({ type: "uuid", length: 36, nullable: true })
      thumbnailId?: string

  @Field(() => String, { nullable: true })
  @Column({ type: "uuid", length: 36, nullable: true })
      lectureVideoId?: string

  @Field(() => String)
  @Column({ name: "sectionId", type: "uuid", length: 36 })
      sectionId: string

  @Field(() => ProcessStatus)
  @Column({ type: "enum", enum: ProcessStatus, default: ProcessStatus.Pending })
      processStatus: ProcessStatus

  @Field(() => VideoType)
  @Column({ type: "enum", enum: VideoType, default: VideoType.MP4 })
      videoType: VideoType
  
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
