import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"
import { ResourceAttachmentEntity } from "./resource-attachment.entity"
import { SectionContentEntity } from "./section_content.entity"

@ObjectType()
@Entity("resource")
export class ResourceEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
        resourceId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
        description: string
        
    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => [ResourceAttachmentEntity], { nullable: true })
    @OneToMany(() => ResourceAttachmentEntity, (resourceAttachment) => resourceAttachment.resource, { cascade: true, nullable: true })
        attachments: Array<ResourceAttachmentEntity>

    @Field(() => SectionContentEntity)
    @OneToOne(() => SectionContentEntity, (sectionContent) => sectionContent.resource, {onDelete: "CASCADE"})
    @JoinColumn({ name: "resourceId" })
        sectionContent: SectionContentEntity
}
