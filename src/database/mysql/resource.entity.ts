import {
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    JoinColumn,
    OneToOne,
    OneToMany
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { SectionContentEntity } from "./section_content.entity"
import { ResourceAttachmentEntity } from "./resource-attachment.entity"

@ObjectType()
@Entity("resource")
export class ResourceEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
        resourceId: string
  
    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => [ResourceAttachmentEntity], { nullable: true })
    @OneToMany(() => ResourceAttachmentEntity, (resourceAttachment) => resourceAttachment.resource, { nullable: true })
        attachments: Array<ResourceAttachmentEntity>

    @Field(() => SectionContentEntity)
    @OneToOne(() => SectionContentEntity, (sectionContent) => sectionContent.resource, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "resourceId" })
        sectionContent: SectionContentEntity
}
