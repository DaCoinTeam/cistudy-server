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
import { ResourceEntity } from "./resource.entity"

@ObjectType()
@Entity("resource-attachment")
export class ResourceAttachmentEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        resourceAttachmentId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        resourceId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 200 })
        name: string

    @Field(() => String)
    @Column({ type: "varchar", length: 200 })
        fileId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => ResourceEntity)
    @ManyToOne(() => ResourceEntity, (resource) => resource.attachments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "resourceId" })
        resource: ResourceEntity

}
