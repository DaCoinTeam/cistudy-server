import {
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    JoinColumn,
    OneToOne
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { SectionContentEntity } from "./section_content.entity"

@ObjectType()
@Entity("resource")
export class ResourceEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
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

    @Field(() => SectionContentEntity)
    @OneToOne(() => SectionContentEntity, (sectionContent) => sectionContent.resource, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "resourceId" })
        sectionContent: SectionContentEntity

}
